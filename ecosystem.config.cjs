module.exports = {
  apps: [
    {
      name: "cuvinte-backend",
      script: "packages/backend/src/index.ts",
      interpreter: "node",
      env: {
        PORT: 3123,
      },
    },
  ],
};
