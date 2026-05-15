import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { ApiResponse, PaginatedResponse, Role, Permission } from '../lib/types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Plus, Settings, X, Shield, Key, Trash2 } from 'lucide-react';

function parseApiError(err: unknown): string {
  if (typeof err === 'string') return err;
  const e = err as any;
  return e?.error?.message || 'Request failed. Please try again.';
}

const RolesPage: React.FC = () => {
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
      fetchRoles();
    } catch (err) {
      setFormErrors({ form: parseApiError(err) });
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
      fetchPermissions();
    } catch (err) {
      setFormErrors({ form: parseApiError(err) });
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
      fetchRoles();
    } catch (err) {
      setFormErrors({ form: parseApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/v1/roles/${id}`);
      fetchRoles();
    } catch (err) {
      alert(parseApiError(err));
    }
  };

  const deletePermission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) return;
    try {
      await api.delete(`/v1/permissions/${id}`);
      fetchPermissions();
    } catch (err) {
      alert(parseApiError(err));
    }
  };

  return (
    <div className="roles-page animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Roles & Permissions</h1>
          <p>Define roles and assign fine-grained permissions.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={openCreatePermission}>
            <Key size={16} /> New Permission
          </Button>
          <Button onClick={openCreateRole}>
            <Shield size={16} /> New Role
          </Button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setActiveTab('roles')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'roles' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            padding: '12px 16px', cursor: 'pointer', borderBottom: activeTab === 'roles' ? '2px solid var(--color-primary)' : '2px solid transparent',
            fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          Roles
        </button>
        <button 
          onClick={() => setActiveTab('permissions')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'permissions' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            padding: '12px 16px', cursor: 'pointer', borderBottom: activeTab === 'permissions' ? '2px solid var(--color-primary)' : '2px solid transparent',
            fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          Permissions
        </button>
      </div>

      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {rolesLoading ? (
            <div style={{ color: 'var(--color-text-muted)' }}>Loading roles...</div>
          ) : roles.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', padding: '24px' }}>No roles found.</div>
          ) : (
            roles.map((role) => (
              <Card key={role.id} title={role.name}>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    Permissions ({role.permissions?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
                    {role.permissions && role.permissions.length > 0 ? role.permissions.map(p => (
                      <Badge key={p.permission.id} variant="info">{p.permission.code}</Badge>
                    )) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No permissions assigned</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openManageRole(role)}>
                    <Settings size={16} /> Manage
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)} title="Delete Role">
                    <Trash2 size={16} color="#f87171" />
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
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading permissions...</div>
          ) : permissions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No permissions found.</div>
          ) : (
            <Table headers={['Code', 'Description', 'Actions']}>
              {permissions.map((perm) => (
                <tr key={perm.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{perm.code}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{perm.description}</td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => deletePermission(perm.id)} title="Delete Permission">
                      <Trash2 size={16} color="#f87171" />
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
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
          }}
          onClick={closeModal}
        >
          <div style={{ width: '100%', maxWidth: modalMode === 'manageRole' ? '600px' : '440px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button" onClick={closeModal}
              style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1, background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
            <Card>
              {modalMode === 'createRole' && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>New Role</h2>
                  <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Creates a new role (requires roles:write).</p>
                  {formErrors.form && <div className="login-error" style={{ marginBottom: '16px' }}>{formErrors.form}</div>}
                  <form onSubmit={submitCreateRole}>
                    <Input label="Role Name" value={formName} onChange={(e) => setFormName(e.target.value)} error={formErrors.name} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
                      <Button type="submit" isLoading={saving}>Create Role</Button>
                    </div>
                  </form>
                </>
              )}

              {modalMode === 'createPermission' && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>New Permission</h2>
                  <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Creates a new permission. Code must be unique (ex: users:read).</p>
                  {formErrors.form && <div className="login-error" style={{ marginBottom: '16px' }}>{formErrors.form}</div>}
                  <form onSubmit={submitCreatePermission}>
                    <Input label="Permission Code" placeholder="users:write" value={formCode} onChange={(e) => setFormCode(e.target.value)} error={formErrors.code} />
                    <Input label="Description" placeholder="Allows creating and editing users" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} error={formErrors.description} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
                      <Button type="submit" isLoading={saving}>Create Permission</Button>
                    </div>
                  </form>
                </>
              )}

              {modalMode === 'manageRole' && managingRole && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Manage Role: {managingRole.name}</h2>
                  <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Assign or remove permissions from this role.</p>
                  {formErrors.form && <div className="login-error" style={{ marginBottom: '16px' }}>{formErrors.form}</div>}
                  <form onSubmit={submitManageRole}>
                    <div style={{ maxHeight: '350px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      {permissions.map(perm => (
                        <label key={perm.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '8px', background: selectedPermissionIds.has(perm.id) ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '6px', border: selectedPermissionIds.has(perm.id) ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid transparent', transition: 'all 0.2s' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedPermissionIds.has(perm.id)} 
                            onChange={(e) => {
                              const next = new Set(selectedPermissionIds);
                              if (e.target.checked) next.add(perm.id);
                              else next.delete(perm.id);
                              setSelectedPermissionIds(next);
                            }}
                            style={{ marginTop: '4px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: selectedPermissionIds.has(perm.id) ? 'var(--color-primary)' : 'inherit' }}>{perm.code}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{perm.description}</div>
                          </div>
                        </label>
                      ))}
                      {permissions.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>No permissions available. Create some first.</div>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
                      <Button type="submit" isLoading={saving}>Save Permissions</Button>
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
