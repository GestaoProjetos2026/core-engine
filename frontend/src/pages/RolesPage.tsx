import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { ApiResponse, Role, Permission } from '../lib/types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Settings, X, Shield, Key, Trash2 } from 'lucide-react';
import { PageLoading } from '../components/ui/PageLoading';
import { useToast } from '../context/ToastContext';
import './AdminPages.css';

function parseApiError(err: unknown): string {
  if (typeof err === 'string') return err;
  const e = err as any;
  return e?.error?.message || 'Request failed. Please try again.';
}

const RolesPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Modal State
  const [modalMode, setModalMode] = useState<'createRole' | 'createPermission' | 'manageRole' | null>(null);
  const [managingRole, setManagingRole] = useState<Role | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; code?: string; description?: string; form?: string }>({});
  const [saving, setSaving] = useState(false);

  // Manage Role State
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const response = await api.get<ApiResponse<Role[]>>('/v1/roles') as unknown as ApiResponse<Role[]>;
      // Backend should return list of roles
      setRoles(Array.isArray(response.data) ? response.data : ((response.data as any).items || []));
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    try {
      const response = await api.get<ApiResponse<Permission[]>>('/v1/permissions') as unknown as ApiResponse<Permission[]>;
      setPermissions(Array.isArray(response.data) ? response.data : ((response.data as any).items || []));
    } catch (error) {
      console.error('Failed to fetch permissions', error);
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const closeModal = () => {
    setModalMode(null);
    setManagingRole(null);
    setFormErrors({});
  };

  const openCreateRole = () => {
    setModalMode('createRole');
    setFormName('');
    setFormDescription('');
    setFormErrors({});
  };

  const openCreatePermission = () => {
    setModalMode('createPermission');
    setFormCode('');
    setFormDescription('');
    setFormErrors({});
  };

  const openManageRole = (role: Role) => {
    setModalMode('manageRole');
    setManagingRole(role);
    const existingIds = role.permissions?.map(p => p.permission.id) || [];
    setSelectedPermissionIds(new Set(existingIds));
    setFormErrors({});
  };

  const submitCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormErrors({ name: 'Role name is required.' });
      return;
    }
    setSaving(true);
    setFormErrors({});
    try {
      await api.post('/v1/roles', { name: formName.trim() });
      closeModal();
      await fetchRoles();
      showToast('Role created successfully.', 'success');
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const submitCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof formErrors = {};
    if (!formCode.trim()) nextErrors.code = 'Permission code is required.';
    if (!formDescription.trim()) nextErrors.description = 'Description is required.';
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setSaving(true);
    setFormErrors({});
    try {
      await api.post('/v1/permissions', { code: formCode.trim(), description: formDescription.trim() });
      closeModal();
      await fetchPermissions();
      showToast('Permission created successfully.', 'success');
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const submitManageRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingRole) return;
    setSaving(true);
    setFormErrors({});
    try {
      const currentIds = managingRole.permissions?.map(p => p.permission.id) || [];
      const targetIds = Array.from(selectedPermissionIds);

      const toAdd = targetIds.filter(id => !currentIds.includes(id));
      const toRemove = currentIds.filter(id => !targetIds.includes(id));

      if (toAdd.length > 0) {
        await api.post(`/v1/roles/${managingRole.id}/permissions`, { permissionIds: toAdd });
      }
      for (const id of toRemove) {
        await api.delete(`/v1/roles/${managingRole.id}/permissions/${id}`);
      }

      closeModal();
      await fetchRoles();
      showToast('Role permissions updated.', 'success');
    } catch (err) {
      const msg = parseApiError(err);
      setFormErrors({ form: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/v1/roles/${id}`);
      await fetchRoles();
      showToast('Role deleted.', 'success');
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  const deletePermission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) return;
    try {
      await api.delete(`/v1/permissions/${id}`);
      await fetchPermissions();
      showToast('Permission deleted.', 'success');
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  return (
    <div className="admin-page roles-page animate-fade-in">
      <header className="page-header page-header--toolbar">
        <div>
          <h1>Roles & Permissions</h1>
          <p>Define roles and assign fine-grained permissions.</p>
        </div>
        <div className="page-header__actions">
          <Button variant="secondary" onClick={openCreatePermission}>
            <Key size={16} /> New Permission
          </Button>
          <Button onClick={openCreateRole}>
            <Shield size={16} /> New Role
          </Button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'roles' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'permissions' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions
        </button>
      </div>

      {activeTab === 'roles' && (
        <div className="roles-grid">
          {rolesLoading ? (
            <PageLoading message="Loading roles…" />
          ) : roles.length === 0 ? (
            <div className="admin-state-message">No roles found.</div>
          ) : (
            roles.map((role) => (
              <Card key={role.id} title={role.name}>
                <div className="role-perms-section">
                  <h4 className="role-perms-title">Permissions ({role.permissions?.length || 0})</h4>
                  <div className="role-perms-list">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((p) => (
                        <Badge key={p.permission.id} variant="info">
                          {p.permission.code}
                        </Badge>
                      ))
                    ) : (
                      <span className="role-perms-empty">No permissions assigned</span>
                    )}
                  </div>
                </div>
                <div className="role-card-actions">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openManageRole(role)}>
                    <Settings size={16} /> Manage
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)} title="Delete Role">
                    <Trash2 size={16} className="icon-action-danger" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'permissions' && (
        <Card>
          {permissionsLoading ? (
            <PageLoading message="Loading permissions…" />
          ) : permissions.length === 0 ? (
            <div className="admin-state-message">No permissions found.</div>
          ) : (
            <Table headers={['Code', 'Description', 'Actions']}>
              {permissions.map((perm) => (
                <tr key={perm.id}>
                  <td className="perm-code-cell">{perm.code}</td>
                  <td className="admin-td-muted">{perm.description}</td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => deletePermission(perm.id)} title="Delete Permission">
                      <Trash2 size={16} className="icon-action-danger" />
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {modalMode && (
        <div
          role="dialog"
          aria-modal="true"
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={`admin-modal-panel ${modalMode === 'manageRole' ? 'admin-modal-panel--wide' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="admin-modal-close" aria-label="Close" onClick={closeModal}>
              <X size={20} />
            </button>
            <Card className="modal-card">
              {modalMode === 'createRole' && (
                <>
                  <h2 className="modal-title">New Role</h2>
                  <p className="modal-desc">Creates a new role (requires roles:write).</p>
                  {formErrors.form && <div className="admin-alert admin-alert--error">{formErrors.form}</div>}
                  <form onSubmit={submitCreateRole}>
                    <Input label="Role Name" value={formName} onChange={(e) => setFormName(e.target.value)} error={formErrors.name} />
                    <div className="modal-form-actions">
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={saving}>
                        Create Role
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {modalMode === 'createPermission' && (
                <>
                  <h2 className="modal-title">New Permission</h2>
                  <p className="modal-desc">Creates a new permission. Code must be unique (ex: users:read).</p>
                  {formErrors.form && <div className="admin-alert admin-alert--error">{formErrors.form}</div>}
                  <form onSubmit={submitCreatePermission}>
                    <Input label="Permission Code" placeholder="users:write" value={formCode} onChange={(e) => setFormCode(e.target.value)} error={formErrors.code} />
                    <Input label="Description" placeholder="Allows creating and editing users" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} error={formErrors.description} />
                    <div className="modal-form-actions">
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={saving}>
                        Create Permission
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {modalMode === 'manageRole' && managingRole && (
                <>
                  <h2 className="modal-title">Manage Role: {managingRole.name}</h2>
                  <p className="modal-desc">Assign or remove permissions from this role.</p>
                  {formErrors.form && <div className="admin-alert admin-alert--error">{formErrors.form}</div>}
                  <form onSubmit={submitManageRole}>
                    <div className="checkbox-grid">
                      {permissions.map((perm) => (
                        <label
                          key={perm.id}
                          className={`checkbox-item ${selectedPermissionIds.has(perm.id) ? 'checkbox-item--selected' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissionIds.has(perm.id)}
                            onChange={(e) => {
                              const next = new Set(selectedPermissionIds);
                              if (e.target.checked) next.add(perm.id);
                              else next.delete(perm.id);
                              setSelectedPermissionIds(next);
                            }}
                          />
                          <div>
                            <div className="checkbox-item__code">{perm.code}</div>
                            <div className="checkbox-item__desc">{perm.description}</div>
                          </div>
                        </label>
                      ))}
                      {permissions.length === 0 && (
                        <div className="role-perms-empty">No permissions available. Create some first.</div>
                      )}
                    </div>

                    <div className="modal-form-actions">
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={saving}>
                        Save Permissions
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
