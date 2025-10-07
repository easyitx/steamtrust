module.exports = {
  apps: [
    {
      name: 'authentication',
      script: 'npm',
      args: 'run start:auth',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'billing',
      script: 'npm',
      args: 'run start:billing',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'telegram',
      script: 'npm',
      args: 'run start:telegram',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
