module.exports = {
  apps: [
    {
      name: 'prepify-backend',
      script: './server.ts',
      interpreter: './node_modules/.bin/tsx',
      exec_mode: 'fork',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
