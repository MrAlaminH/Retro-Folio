import test from "node:test";
import assert from "node:assert/strict";
import { extractChatReply } from "../lib/chat-reply.ts";
import { parseStoredFont, getFontFamily } from "../lib/font.ts";

test("extractChatReply handles null, malformed shapes, and array/object payloads safely", () => {
  assert.equal(extractChatReply(null), "");
  assert.equal(extractChatReply(undefined), "");
  assert.equal(extractChatReply({ output: 42 }), "");
  assert.equal(extractChatReply([{ output: "  Hello!  " }]), "Hello!");
  assert.equal(extractChatReply({ response: " Hi there " }), "Hi there");
  assert.equal(extractChatReply({ reply: " Answered " }), "Answered");
  assert.equal(extractChatReply({ output: " Done " }), "Done");
});

test("parseStoredFont validates stored values and falls back to departureMono", () => {
  assert.equal(parseStoredFont("Kalam"), "Kalam");
  assert.equal(parseStoredFont("inter"), "inter");
  assert.equal(parseStoredFont("departureMono"), "departureMono");
  assert.equal(parseStoredFont("ComicSans"), "departureMono");
  assert.equal(parseStoredFont(null), "departureMono");

  assert.equal(getFontFamily("Kalam"), "'Kalam', cursive");
  assert.equal(getFontFamily("inter"), "'Inter', sans-serif");
  assert.equal(getFontFamily("departureMono"), "'Departure Mono', monospace");
});
