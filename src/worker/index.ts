import { Hono } from "hono";

// Version info - will be replaced during build
const VERSION_INFO = {
  version: "__VERSION__",
  commitHash: "__COMMIT_HASH__", 
  buildTime: "__BUILD_TIME__"
};

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/version", (c) => {
  return c.json({
    version: VERSION_INFO.version,
    commitHash: VERSION_INFO.commitHash,
    buildTime: VERSION_INFO.buildTime,
    timestamp: new Date().toISOString()
  });
});

export default app;
