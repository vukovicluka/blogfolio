---
title: "SQL triggers vs stored procedures"
description: "Using two RDMS components in complementary ways"
publishDate: 2026-05-16
tags: ["triggers", stored procedures]
---

On all projects that I've worked on there was some kind of data storage layer, a database.
Database is usually a single source of truth in a system, all the data revolving aroung system entities is stored there.
This blog is focusing on relational databases which I use the most.
When we talk about relation databases, you often hear about CRUD operations on the database - `CREATE`, `READ`, `UPDATE`, `DELETE` on the relations, as each relation represents some kind of system entity.
Apart from the most obvious part, a lot of times when working with the database, you have to encapsulate some kind of a business logic.
For that we use two essential components of RDBMS - SQL triggers and stored procedures. Each of them serve a different purpose, and they are best used in complementary ways. In this blog I will present the differences and use cases when to use which.

# Stored procedures

A stored procedure is a user-defined SQL code written in SQL that is invoked manually by the user, and it may or may not return a value, making it behave like a function in SQL.
Whenever you have multiple tasks that need to be performed on the database - tasks that encapsulate some business logic, you write a stored procedure to encapsulate all the tasks and then you execute that procedure explicitly when needed. By encapsulating multiple interactions with the database, stored procedure is highly versatile and reusable.

One common thing that we also use stored procedures for on the projects is to simply introduce more security in the database. For example when you need to delete a certain row from the relation, you can forbid the direct `DELETE` SQL operation, and allow deleting only via a stored procedure, and then give the ability to call the stored procedure only to certain application users - for example only to `backend` user and not to `api` and `batch` users.

Syntax:

```ts
Create procedure procedure_name (list of the parameters….)

Begin

--code of the SQL statement

End;
```

# SQL triggers

SQL triggers are special type of stored procedures that are executed automatically, or "triggered", when some event occurs on the relation. These events are typically `INSERT`, `UPDATE` or `DELETE` operations. For example whenever you have to listen for an insert event on certain relation, and when this event happens you want to immediatly execute some additional insertion of audit. As triggers are event-driven they can be set to execute after, or even before the event occurs, which is used for pre-processing or post-processing of data.

Triggers are typically used to ensure data quality and integrity or for audit trails.

Syntax:

```ts
Create trigger trigger_name

[Before | After] [Insert | Update | Delete]

On table_name

[for each row and column]

As

Set of SQL statement
```

# When to use which

Both stored procedures and triggers are similar but different and are used for different purposes.
When you need event-driven action on the database, you use SQL trigger. SQL trigger encapsulates smaller logic that is event-driven and it needs to be as fast as possible because it'll affect the write speed of every insert/update/delete on the relation.
When you have more complex business logic, that is called explicity by the application users, then you wrap that up in a stored procedure that does the work.
