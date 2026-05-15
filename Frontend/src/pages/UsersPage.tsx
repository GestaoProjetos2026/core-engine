import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { AdminUserListItem, ApiResponse, PaginatedResponse } from '../lib/types';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, UserCog, Power, ChevronLeft, ChevronRight, X } from 'lucide-react';

type ApiErrorShape = { error?: { message?: string; code?: string } };

function parseApiError(err: unknown): string {
  if (typeof err === 'string') return err;
  const e = err as ApiErrorShape;
  return e?.error?.message || 'Request failed. Please try again.';
}

function validatePasswordPolicy(password: string): string | undefined {
  if (password.length < 10) {
    return 'Password must be at least 10 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include an uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include a lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include a number.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include a special character.';
  }
  return undefined;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [emailFilter, setEmailFilter] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | ''>('');
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedEmail(emailFilter.trim()), 400);
    return () => window.clearTimeout(id);
  }, [emailFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedEmail, statusFilter]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const params: Record<string, string | number> = { page, limit };
      if (debouncedEmail) params.email = debouncedEmail;
      if (statusFilter) params.status = statusFilter;

      const response = (await api.get<ApiResponse<PaginatedResponse<AdminUserListItem>>>('/v1/users', {
        params,
      })) as unknown as ApiResponse<PaginatedResponse<AdminUserListItem>>;

      if (response && response.data) {
        const data = response.data;
        if (Array.isArray(data)) {
          setUsers(data);
          setTotal(data.length);
        } else if (data.items) {
          setUsers(data.items);
          setTotal(data.total ?? data.items.length);
        } else {
          setUsers([]);
          setTotal(0);
        }
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setListError(parseApiError(error));
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedEmail, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setListError(''); // Clear any list errors when opening modal
    setModalMode('create');
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormErrors({});
  };

  const openEdit = (user: AdminUserListItem) => {
    setListError('');
    setModalMode('edit');
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormErrors({});
  };

  const closeModal = useCallback(() => {
    setModalMode(null);
    setEditingUser(null);
    setFormErrors({});
  }, []);

  const validateCreate = (): boolean => {
    const next: typeof formErrors = {};
    if (!formName.trim()) next.name = 'Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim()) next.email = 'Email is required.';
    else if (!emailRegex.test(formEmail.trim())) next.email = 'Enter a valid email address.';
    const pwErr = validatePasswordPolicy(formPassword);
    if (pwErr) next.password = pwErr;
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateEdit = (): boolean => {
    const next: typeof formErrors = {};
    if (!formName.trim()) next.name = 'Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim()) next.email = 'Email is required.';
    else if (!emailRegex.test(formEmail.trim())) next.email = 'Enter a valid email address.';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreate()) return;
    setSaving(true);
    setFormErrors({});
    try {
      await api.post('/v1/users', {
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword,
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      setFormErrors({ form: parseApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !validateEdit()) return;
    setSaving(true);
    setFormErrors({});
    try {
      await api.patch(`/v1/users/${editingUser.id}`, {
        name: formName.trim(),
        email: formEmail.trim(),
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      setFormErrors({ form: parseApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: AdminUserListItem) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/v1/users/${user.id}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert(parseApiError(err));
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="users-page animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>User Management</h1>
          <p>Create and manage user accounts (RF09 — admin API).</p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus size={20} />
          New User
        </Button>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 220px', minWidth: 0, position: 'relative' }}>
            <Input
              label="Search by email"
              type="search"
              placeholder="Filter contains…"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              autoComplete="off"
            />
            {emailFilter && (
              <button
                type="button"
                onClick={() => setEmailFilter('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '36px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '6px' }}>
              Status
            </label>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | '')}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div style={{ flex: '0 0 100px' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '6px' }}>
              Per page
            </label>
            <select
              className="input-field"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              style={{ width: '100%', cursor: 'pointer' }}
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

      {listError && (
        <div className="login-error" style={{ marginBottom: '16px' }}>
          {listError}
        </div>
      )}

      <Card>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading users…</div>
        ) : users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No users match the current filters.
          </div>
        ) : (
          <>
            <Table headers={['Name', 'Email', 'Status', 'Created', 'Actions']}>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>{user.status}</Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(user.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="ghost" size="sm" type="button" title="Edit user" onClick={() => openEdit(user)}>
                        <UserCog size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" type="button" title="Toggle active status" onClick={() => toggleStatus(user)}>
                        <Power size={16} color={user.status === 'ACTIVE' ? '#f87171' : '#4ade80'} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {total === 0 ? '0 users' : `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`}
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button variant="outline" size="sm" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
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

      {modalMode && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{ width: '100%', maxWidth: '440px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
            <Card>
            <h2 style={{ marginTop: 0, marginBottom: '8px' }}>{modalMode === 'create' ? 'New user' : 'Edit user'}</h2>
            <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {modalMode === 'create'
                ? 'Creates an account via POST /v1/users (requires users:write).'
                : 'Updates name and email via PATCH /v1/users/:id.'}
            </p>

            {formErrors.form && <div className="login-error" style={{ marginBottom: '16px' }}>{formErrors.form}</div>}

            <form onSubmit={modalMode === 'create' ? submitCreate : submitEdit}>
              <Input label="Full name" value={formName} onChange={(e) => setFormName(e.target.value)} error={formErrors.name} autoComplete="name" />
              <Input
                label="Email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                error={formErrors.email}
                autoComplete="email"
              />
              {modalMode === 'create' && (
                <Input
                  label="Initial password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  error={formErrors.password}
                  autoComplete="new-password"
                  placeholder="Min. 10 chars, mixed case, number, symbol"
                />
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving}>
                  {modalMode === 'create' ? 'Create user' : 'Save changes'}
                </Button>
              </div>
            </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
