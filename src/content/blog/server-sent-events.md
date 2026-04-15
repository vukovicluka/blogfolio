---
title: "Don't jump to Websockets, default to Server-Sent Events for real-time updates"
description: "Recent project problem showed me a simpler way of updating client UI in real-time using SSE instead of Websockets"
publishDate: 2026-04-11
tags: ["sse", websockets]
---

# Use case

In the project I'm currently working on we have two parts of the application (that matter for the context). Frontend part of the client is the
dashboard web application built with React and Java Spring Boot backend server which is the brain of the system.

Users of the application work with different domain entities that have different properties, for the sake of simplicity let's just consider each entity has an `ID` and `status` property - `ID` as unique identifier in the database and `status` of the entity which is enumeration with values `OPEN`, `PROCESSING`, `WAITING`, `COMPLETED` and `REJECTED`.

Each entity starts with `OPEN`, and after various business logic use cases, finishes in either `COMPLETED` or `REJECTED` status.

Status can change with different actions on the client and mix of domain logic on the backend. If an action on the client triggers the status change, we can easily invalidate the current status, either by returning new status in action response or triggering new GET request to refresh the status, but what happens when the domain business logic changes the status on the backend, without client actions? How can we refresh the client data so the user of the application sees the latest status?

# Websockets

First thing that came to my mind when hearing "real-time" were Websockets. With Websockets we can establish a two-way communication between client and backend, and stream the updates to the client. But if we read the use case above again, we see that we don't really have two-way communication, because client doesn't talk with backend directly, client doesn't send any data to the backend, it just waits for some information (event, message) if status changes while the user is still working with corresponding entity.

# Pooling, Query invalidation...

One other option would also be to handle this use case with some kind of `pooling` - periodically calling the backend api and check if status changed.

Also, since we are using Tanstack Query, we could use `useQuery`'s option `refetchInterval`, which also accepts some interval after which the query should be refetched.

This would work, but how can we specify the time interval - some magic number? every second?, every 5 seconds? You see where I'm going with this.

# Server-sent events

Enter Server-sent events, a one-way connection to stream events from the server to the client.
With that we accomplished much simpler and straightforward real-time updates to the entity status.

Basically how this works - user makes some actions on the entity client side, server receives the data and starts working with the data, going through the domain logic, talking to some external services, and after arbitrary time, it can change the status of the entity, if this happens, the api endpoint behaves as an event stream, and once the status changes, endpoint emits the event in real time to the client, which is listening and ready to receive the new status, which is then rerender on the client.

Streamlined (FE) version focused on the key concept:

```tsx
import { useState, useEffect } from "react";

// ---

function useEntityStatusSSE(
  entityId: string,
  onStatusChange: (next: Status, prev: Status | null) => void,
) {
  const [status, setStatus] = useState<Status | null>(null);

  const onMessage = useEffectEvent((e: MessageEvent) => {
    const { status: next } = JSON.parse(e.data);
    setStatus((prev) => {
      onStatusChange(next, prev);
      return next;
    });
  });

  useEffect(() => {
    const es = new EventSource(`/api/entities/${entityId}/status-stream`);
    es.onmessage = onMessage;
    return () => es.close();
  }, [entityId]);

  return status;
}
```

# Auth

Application uses `HttpOnly` cookies which are a browser mechanism and SSE authenticates the same way as any other fetch request - browser sends the cookies via HTTPS requests automatically.

# References

[MDN - Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
