const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  PORT,
  ALLOWED_ORIGINS,
} = process.env;

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable.");
}

const configKey = SUPABASE_ANON_KEY ?? SUPABASE_SERVICE_ROLE_KEY;

if (!configKey) {
  throw new Error(
    "Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

const app = express();

const allowedOrigins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["https://justkeephiking.com", "https://app.justkeephiking.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());

const configClient = createClient(SUPABASE_URL, configKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const adminClient = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/config", async (_req, res) => {
  try {
    const { data, error } = await configClient
      .from("site_config")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ config: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  const page = Number.parseInt(req.query.page ?? "1", 10);
  const perPage = Number.parseInt(req.query.perPage ?? "50", 10);

  if (Number.isNaN(page) || Number.isNaN(perPage) || page < 1 || perPage < 1) {
    res
      .status(400)
      .json({ error: "page and perPage must be positive integers" });
    return;
  }

  if (!adminClient) {
    res.status(501).json({
      error:
        "SUPABASE_SERVICE_ROLE_KEY is required to list users in this environment.",
    });
    return;
  }

  try {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
    }));

    res.json({ users, page, perPage, total: data.total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = Number.parseInt(PORT ?? "4000", 10);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
