import { test } from "node:test";
import assert from "node:assert/strict";
import { session } from "../mods/session-titles-tabs/session.js";

const claude = (title) => ({ title, app: "claude-code", program: { key: "claude", name: "Claude Code", agent: true } });

test("Claude Code: the conversation title, without its status mark or spinner", () => {
  assert.equal(session(claude("✳ pg-db-creation-guidance")), "pg-db-creation-guidance");
  assert.equal(session(claude("⠂ fix login bug")), "fix login bug");
  assert.equal(session(claude("security-shield-day")), "security-shield-day");
});

test("Claude Code: no session before the conversation has a title", () => {
  assert.equal(session(claude("Claude Code")), "");
  assert.equal(session(claude("✳ Claude Code")), "");
});

test("no session in a path, a passing state, or an empty title", () => {
  assert.equal(session(claude("~/Developer/workboard")), "");
  assert.equal(session(claude("/usr/local/bin")), "");
  assert.equal(session(claude("working…")), "");
  assert.equal(session(claude("")), "");
  assert.equal(session({}), "");
});

test("control characters in a title don't leak into the label", () => {
  assert.equal(session(claude("✳ my\u0007 task")), "my task");
});

test("Pi: the session between the mark and the folder", () => {
  assert.equal(session({ title: "π - fix login - repo", app: "pi" }), "fix login");
  assert.equal(session({ title: "π - repo", app: "pi" }), "");
});

test("Codex: the thread before the project", () => {
  assert.equal(session({ title: "⠋ refactor auth | repo", app: "codex" }), "refactor auth");
  assert.equal(session({ title: "[ ! ] Action Required | refactor auth | repo", app: "codex" }), "refactor auth");
  assert.equal(session({ title: "repo", app: "codex" }), "");
});

test("OpenCode: the session after its prefix", () => {
  assert.equal(session({ title: "OC | write docs", app: "opencode" }), "write docs");
  assert.equal(session({ title: "OpenCode", app: "opencode" }), "");
});

test("Gemini CLI: never a session", () => {
  assert.equal(session({ title: "◇  Ready (repo)", app: "gemini" }), "");
});

test("the harness is told by its title when the app doesn't say", () => {
  assert.equal(session({ title: "π - fix login - repo" }), "fix login");
  assert.equal(session({ title: "OC | write docs" }), "write docs");
});
