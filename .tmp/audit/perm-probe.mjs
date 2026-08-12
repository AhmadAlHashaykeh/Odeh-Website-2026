/**
 * Temporary restricted-admin permission probe. Creates and deletes audit user only.
 */
const API = 'http://127.0.0.1:8000/api';

async function json(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, body };
}

async function main() {
  const login = await json(`${API}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@odeh.local', password: 'OdehLocalDev2026!' }),
  });
  const token = login.body?.data?.token;
  if (!token) {
    console.log(JSON.stringify({ error: 'super login failed', login }, null, 2));
    process.exit(1);
  }
  const auth = { Authorization: `Bearer ${token}` };

  const roles = await json(`${API}/admin/roles`, { headers: auth });
  const roleList = roles.body?.data || [];
  const editor = roleList.find((r) => /editor|content/i.test(r.slug || r.name || '')) || roleList.find((r) => r.slug !== 'super-admin');

  const created = await json(`${API}/admin/users`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      fullName: 'Audit Restricted User',
      email: `audit.restricted.${Date.now()}@odeh.local`,
      password: 'AuditTempPass2026!',
      passwordConfirmation: 'AuditTempPass2026!',
      roleId: editor?.id,
      status: 'active',
      department: 'Audit',
    }),
  });

  const out = {
    editorRole: editor ? { id: editor.id, slug: editor.slug, name: editor.name } : null,
    createStatus: created.status,
    createBodyKeys: created.body ? Object.keys(created.body) : [],
    createErrors: created.body?.errors || created.body?.message || null,
  };

  const user = created.body?.data;
  if (user?.id && user?.email) {
    // fetch role permissions
    const perms = await json(`${API}/admin/roles/${editor.id}/permissions`, { headers: auth });
    out.permissionModules = (perms.body?.data || []).map((p) => ({
      module: p.module,
      view: p.canView ?? p.can_view,
      create: p.canCreate ?? p.can_create,
    }));

    const restrictedLogin = await json(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: 'AuditTempPass2026!' }),
    });
    out.restrictedLogin = restrictedLogin.status;
    const rToken = restrictedLogin.body?.data?.token;
    if (rToken) {
      const rAuth = { Authorization: `Bearer ${rToken}` };
      out.restrictedAccess = {
        projects: (await json(`${API}/admin/projects`, { headers: rAuth })).status,
        users: (await json(`${API}/admin/users`, { headers: rAuth })).status,
        seo: (await json(`${API}/admin/seo`, { headers: rAuth })).status,
        jobs: (await json(`${API}/admin/jobs`, { headers: rAuth })).status,
      };
      out.restrictedUser = restrictedLogin.body?.data?.user
        ? { role: restrictedLogin.body.data.role?.slug || restrictedLogin.body.data.user?.role }
        : null;
    }

    const del = await json(`${API}/admin/users/${user.id}`, { method: 'DELETE', headers: auth });
    out.deleteStatus = del.status;
  }

  // unauthenticated protected route
  out.unauthProjects = (await json(`${API}/admin/projects`)).status;

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
