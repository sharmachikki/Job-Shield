const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Running seed...');

  // Create roles
  const roles = [
    'SUPER_ADMIN','FINANCE_ADMIN','VERIFICATION_ADMIN','SUPPORT_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN',
    'JOB_SEEKER','EMPLOYER','FREELANCER','TRAINER','MANPOWER_VENDOR'
  ];

  for (const code of roles) {
    try {
      await prisma.$executeRaw`
        INSERT IGNORE INTO roles (code, name, is_admin_role, created_at)
        VALUES (${code}, ${code}, 0, NOW())
      `;
    } catch (e) {
      console.warn('Role insert failed for', code, e.message || e);
    }
  }

  // Create a test admin user (if not exists)
  const adminEmail = 'admin@jobeasy.example';
  const pw = 'Admin#12345';
  const existing = await prisma.$queryRaw`
    SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1
  `;
  if (!existing || existing.length === 0) {
    const hash = await bcrypt.hash(pw, 10);
    try {
      await prisma.$executeRaw`
        INSERT INTO users (uuid, full_name, email, phone, password_hash, status, created_at, updated_at)
        VALUES (UUID(), 'Admin User', ${adminEmail}, '0000000000', ${hash}, 'ACTIVE', NOW(), NOW())
      `;
      const newUser = await prisma.$queryRaw`
        SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1
      `;
      const userId = newUser[0].id;
      // attach SUPER_ADMIN role
      const role = await prisma.$queryRaw`
        SELECT id FROM roles WHERE code = 'SUPER_ADMIN' LIMIT 1
      `;
      if (role && role[0] && role[0].id) {
        await prisma.$executeRaw`
          INSERT IGNORE INTO user_roles (user_id, role_id, is_active, assigned_at)
          VALUES (${userId}, ${role[0].id}, 1, NOW())
        `;
      }
      console.log('Created admin user:', adminEmail, 'password:', pw);
    } catch (e) {
      console.error('Failed to create admin user', e.message || e);
    }
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  console.log('Seed finished.');
  process.exit(0);
}

seed().catch(err => { console.error('Seed error', err); process.exit(1); });
