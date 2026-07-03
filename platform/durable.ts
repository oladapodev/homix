import { Hono } from "hono";

interface CounterState {
  value: number;
}

export class CounterDurableObject implements DurableObject {
  private app = new Hono();

  constructor(private state: DurableObjectState) {
    this.app.get("/", async (c) => {
      const value = await this.getValue();
      return c.html(
        `<button class="btn btn-primary" hx-post="${new URL(c.req.url).pathname}" hx-target="this" hx-swap="outerHTML">Count ${value}</button>`,
      );
    });

    this.app.post("/", async (c) => {
      const value = (await this.getValue()) + 1;
      await this.state.storage.put<CounterState>("counter", { value });
      return c.html(
        `<button class="btn btn-primary" hx-post="${new URL(c.req.url).pathname}" hx-target="this" hx-swap="outerHTML">Count ${value}</button>`,
      );
    });
  }

  fetch(request: Request) {
    return this.app.fetch(request);
  }

  private async getValue() {
    const state = await this.state.storage.get<CounterState>("counter");
    return state?.value ?? 0;
  }
}
