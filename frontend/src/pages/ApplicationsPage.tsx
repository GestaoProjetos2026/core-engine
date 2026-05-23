import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { ApiResponse, ApplicationListItem, ApplicationWithSecret, PaginatedResponse, Scope } from '../lib/types';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Plus,
  RefreshCw,
  Pencil,
  Power,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Layers,
} from 'lucide-react';
import { PageLoading } from '../components/ui/PageLoading';
import { useToast } from '../context/ToastContext';
import './AdminPages.css';

type ApiErrorShape = { error?: { message?: string; code?: string } };

function parseApiError(err: unknown): string {
  if (typeof err === 'string') return err;
  const e = err as ApiErrorShape;
  return e?.error?.message || 'Request failed. Please try again.';
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const ApplicationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [apps, setApps] = useState<ApplicationListItem[]>([]);
  const [scopesByAppId, setScopesByAppId] = useState<Record<string, Scope[]>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nameFilter, setNameFilter] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | ''>('');
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'scopes' | null>(null);
  const [editingApp, setEditingApp] = useState<ApplicationListItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; form?: string }>({});
  const [saving, setSaving] = useState(false);

  const [allScopes, setAllScopes] = useState<Scope[]>([]);
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([]);
  const [scopesLoading, setScopesLoading] = useState(false);

  const [secretReveal, setSecretReveal] = useState<{
    title: string;
    clientId: string;
    clientSecret: string;
  } | null>(null);
  const [secretAcknowledged, setSecretAcknowledged] = useState(false);
  const [copiedField, setCopiedField] = useState<'id' | 'secret' | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedName(nameFilter.trim()), 400);
    return () => window.clearTimeout(id);
  }, [nameFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedName, statusFilter]);

  const loadScopesForApps = async (items: ApplicationListItem[]) => {
    if (items.length === 0) {
      setScopesByAppId({});
      return;
    }
    const entries = await Promise.all(
      items.map(async (app) => {
        try {
          const response = (await api.get<ApiResponse<Scope[]>>(`/v1/applications/${app.id}/scopes`)) as unknown as ApiResponse<Scope[]>;
          return [app.id, response.data] as const;
        } catch {
          return [app.id, [] as Scope[]] as const;
        }
      }),
    );
    setScopesByAppId(Object.fromEntries(entries));
  };

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const params: Record<string, string | number> = { page, limit };
      if (debouncedName) params.name = debouncedName;
      if (statusFilter) params.status = statusFilter;

      const response = (await api.get<ApiResponse<PaginatedResponse<ApplicationListItem>>>('/v1/applications', {
        params,
      })) as unknown as ApiResponse<PaginatedResponse<ApplicationListItem>>;

      setApps(response.data.items);
      setTotal(response.data.total);
      await loadScopesForApps(response.data.items);
    } catch (error) {
      console.error('Failed to fetch applications', error);
      setListError(parseApiError(error));
      setApps([]);
      setTotal(0);
      setScopesByAppId({});
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedName, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApps();
  }, [fetchApps]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setModalMode('create');
    setEditingApp(null);
    setFormName('');
    setFormErrors({});
  };

  const openEdit = (app: ApplicationListItem) => {
    setModalMode('edit');
    setEditingApp(app);
    setFormName(app.name);
    setFormErrors({});
  };

  const openScopes = async (app: ApplicationListItem) => {
    setModalMode('scopes');
    setEditingApp(app);
    setFormErrors({});
    setScopesLoading(true);
    setSelectedScopeIds([]);
    setAllScopes([]);
    try {
      const [catalogRes, appScopesRes] = await Promise.all([
        api.get<ApiResponse<Scope[]>>('/v1/scopes') as unknown as ApiResponse<Scope[]>,
        api.get<ApiResponse<Scope[]>>(`/v1/applications/${app.id}/scopes`) as unknown as ApiResponse<Scope[]>,
      ]);
      setAllScopes(catalogRes.data);
      setSelectedScopeIds(appScopesRes.data.map((s) => s.id));
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setScopesLoading(false);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingApp(null);
    setFormErrors({});
    setAllScopes([]);
    setSelectedScopeIds([]);
  };

  const openSecretReveal = (title: string, clientId: string, clientSecret: string) => {
    setSecretReveal({ title, clientId, clientSecret });
    setSecretAcknowledged(false);
    setCopiedField(null);
  };

  const closeSecretReveal = () => {
    setSecretReveal(null);
    setSecretAcknowledged(false);
    setCopiedField(null);
  };

  const validateName = (): boolean => {
    const next: typeof formErrors = {};
    if (!formName.trim()) next.name = 'Application name is required.';
    else if (formName.trim().length < 2) next.name = 'Name must be at least 2 characters.';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName()) return;
    setSaving(true);
    setFormErrors({});
    try {
      const response = (await api.post<ApiResponse<ApplicationWithSecret>>('/v1/applications', {
        name: formName.trim(),
      })) as unknown as ApiResponse<ApplicationWithSecret>;
      closeModal();
      await fetchApps();
      openSecretReveal(
        'Application created',
        response.data.clientId,
        response.data.clientSecret,
      );
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !validateName()) return;
    setSaving(true);
    setFormErrors({});
    try {
      await api.patch(`/v1/applications/${editingApp.id}`, { name: formName.trim() });
      closeModal();
      await fetchApps();
      showToast('Application updated successfully.', 'success');
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (app: ApplicationListItem) => {
    const newStatus = app.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const label = newStatus === 'INACTIVE' ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${label} "${app.name}"?`)) return;
    try {
      await api.patch(`/v1/applications/${app.id}/status`, { status: newStatus });
      await fetchApps();
      showToast(`Application ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}.`, 'success');
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  const regenerateSecret = async (app: ApplicationListItem) => {
    if (
      !window.confirm(
        `Regenerate the client secret for "${app.name}"?\n\nThe current secret will stop working immediately.`,
      )
    ) {
      return;
    }
    try {
      const response = (await api.post<ApiResponse<ApplicationWithSecret>>(
        `/v1/applications/${app.id}/regenerate-secret`,
      )) as unknown as ApiResponse<ApplicationWithSecret>;
      openSecretReveal('Secret regenerated', response.data.clientId, response.data.clientSecret);
      showToast('Client secret regenerated. Copy it from the dialog.', 'warning');
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  const toggleScopeSelection = (scopeId: string) => {
    setSelectedScopeIds((prev) =>
      prev.includes(scopeId) ? prev.filter((id) => id !== scopeId) : [...prev, scopeId],
    );
  };

  const submitScopes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setSaving(true);
    setFormErrors({});
    try {
      await api.post(`/v1/applications/${editingApp.id}/scopes`, { scopeIds: selectedScopeIds });
      closeModal();
      await fetchApps();
      showToast('Application scopes saved.', 'success');
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (field: 'id' | 'secret', value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopiedField(field);
      showToast(field === 'secret' ? 'Client secret copied.' : 'Client ID copied.', 'success');
      window.setTimeout(() => setCopiedField(null), 2000);
    } else {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  return (
    <div className="admin-page applications-page animate-fade-in">
      <header className="page-header page-header--toolbar">
        <div>
          <h1>M2M Applications</h1>
          <p>Register integration clients, rotate secrets, and assign OAuth scopes (RF14–RF16).</p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus size={20} />
          Register App
        </Button>
      </header>

      <div className="admin-filters">
        <Card>
          <div className="admin-filters__row">
            <div className="admin-filter-field">
              <Input
                label="Search by name"
                type="search"
                placeholder="Filter contains…"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="admin-filter-field admin-filter-field--narrow">
              <label className="admin-select-label">Status</label>
              <select
                className="input-field admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | '')}
              >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="admin-filter-field admin-filter-field--limit">
              <label className="admin-select-label">Per page</label>
              <select
                className="input-field admin-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      {listError && <div className="admin-alert admin-alert--error">{listError}</div>}

      <Card>
        {loading ? (
          <PageLoading message="Loading applications…" />
        ) : apps.length === 0 ? (
          <div className="admin-state-message">No applications match the current filters.</div>
        ) : (
          <>
            <Table headers={['Name', 'Client ID', 'Scopes', 'Status', 'Actions']}>
              {apps.map((app) => {
                const appScopes = scopesByAppId[app.id] ?? [];
                return (
                  <tr key={app.id}>
                    <td className="admin-td-strong">{app.name}</td>
                    <td>
                      <code className="admin-td-code">{app.clientId}</code>
                    </td>
                    <td>
                      <div className="admin-badge-row">
                        {appScopes.length === 0 ? (
                          <span className="admin-td-muted">None</span>
                        ) : (
                          appScopes.map((s) => (
                            <Badge key={s.id} variant="warning">
                              {s.code}
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge variant={app.status === 'ACTIVE' ? 'success' : 'error'}>{app.status}</Badge>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Button variant="ghost" size="sm" type="button" title="Edit application" onClick={() => openEdit(app)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" type="button" title="Manage scopes" onClick={() => openScopes(app)}>
                          <Layers size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          title="Regenerate client secret"
                          onClick={() => regenerateSecret(app)}
                        >
                          <RefreshCw size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          title="Toggle active status"
                          onClick={() => toggleStatus(app)}
                        >
                          <Power
                            size={16}
                            className={app.status === 'ACTIVE' ? 'icon-action-deactivate' : 'icon-action-activate'}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
            <div className="admin-pagination">
              <span className="admin-pagination__info">
                {total === 0 ? '0 applications' : `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`}
              </span>
              <div className="admin-pagination__controls">
                <Button variant="outline" size="sm" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <span className="admin-pagination__info">
                  Page {page} / {totalPages}
                </span>
                <Button variant="outline" size="sm" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {modalMode && modalMode !== 'scopes' && (
        <div
          role="dialog"
          aria-modal="true"
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="admin-modal-close" aria-label="Close" onClick={closeModal}>
              <X size={20} />
            </button>
            <Card className="modal-card">
              <h2 className="modal-title">{modalMode === 'create' ? 'Register application' : 'Edit application'}</h2>
              <p className="modal-desc">
                {modalMode === 'create'
                  ? 'Creates an M2M client via POST /v1/applications. The client secret is shown only once.'
                  : 'Updates the display name via PATCH /v1/applications/:id.'}
              </p>

              {formErrors.form && <div className="admin-alert admin-alert--error">{formErrors.form}</div>}

              <form onSubmit={modalMode === 'create' ? submitCreate : submitEdit}>
                <Input
                  label="Application name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  error={formErrors.name}
                  autoComplete="off"
                  placeholder="e.g. Orders Integration"
                />

                <div className="modal-form-actions">
                  <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={saving}>
                    {modalMode === 'create' ? 'Create application' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {modalMode === 'scopes' && editingApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="admin-modal-panel admin-modal-panel--scopes" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="admin-modal-close" aria-label="Close" onClick={closeModal}>
              <X size={20} />
            </button>
            <Card className="modal-card">
              <h2 className="modal-title">Manage scopes</h2>
              <p className="modal-desc">
                Assign OAuth scopes for <strong>{editingApp.name}</strong>. Saving replaces all current associations.
              </p>

              {formErrors.form && <div className="admin-alert admin-alert--error">{formErrors.form}</div>}

              {scopesLoading ? (
                <PageLoading message="Loading scopes…" compact />
              ) : allScopes.length === 0 ? (
                <p className="admin-td-muted">No scopes in the catalog. Create scopes via the API (POST /v1/scopes) first.</p>
              ) : (
                <form onSubmit={submitScopes}>
                  <div className="scope-list">
                    {allScopes.map((scope) => (
                      <label
                        key={scope.id}
                        className={`scope-option ${selectedScopeIds.includes(scope.id) ? 'scope-option--selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedScopeIds.includes(scope.id)}
                          onChange={() => toggleScopeSelection(scope.id)}
                        />
                        <span>
                          <span className="scope-option__code">{scope.code}</span>
                          {scope.description && <span className="scope-option__desc">{scope.description}</span>}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="modal-form-actions">
                    <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={saving}>
                      Save scopes ({selectedScopeIds.length})
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      )}

      {secretReveal && (
        <div role="dialog" aria-modal="true" className="admin-modal-overlay admin-modal-overlay--priority">
          <div className="admin-modal-panel admin-modal-panel--secret">
            <Card className="modal-card">
              <h2 className="modal-title modal-title--brand">{secretReveal.title}</h2>
              <p className="modal-desc">
                Copy and store the <strong>client secret</strong> now. It will not be shown again (RN02).
              </p>

              <div className="admin-alert admin-alert--warning">Never share this secret in chat, email, or version control.</div>

              <div className="secret-field">
                <label className="admin-select-label">Client ID</label>
                <div className="secret-field-row">
                  <code className="admin-td-code secret-code-block">
                    {secretReveal.clientId}
                  </code>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleCopy('id', secretReveal.clientId)}>
                    {copiedField === 'id' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div className="secret-field">
                <label className="admin-select-label">Client secret (one-time)</label>
                <div className="secret-field-row">
                  <code className="admin-td-code admin-td-code--secret secret-code-block">
                    {secretReveal.clientSecret}
                  </code>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleCopy('secret', secretReveal.clientSecret)}>
                    {copiedField === 'secret' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <label className="secret-ack">
                <input
                  type="checkbox"
                  checked={secretAcknowledged}
                  onChange={(e) => setSecretAcknowledged(e.target.checked)}
                />
                I have copied and securely stored the client secret.
              </label>

              <Button type="button" className="w-full" disabled={!secretAcknowledged} onClick={closeSecretReveal}>
                Close
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
