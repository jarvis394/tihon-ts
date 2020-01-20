import Database, { Database as IDatabase } from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbDirPath: string = path.resolve(process.cwd(), 'data')
const dbPath: string = path.resolve(dbDirPath, 'main.sqlite')

if (!fs.existsSync(dbPath)) fs.mkdirSync(dbDirPath)

const db: IDatabase = new Database(dbPath)

// Create users table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "users" (
    "id"	        INTEGER NOT NULL,
    "money"	      INTEGER NOT NULL DEFAULT 0,
    "reputation"	INTEGER NOT NULL DEFAULT 0,
    "guild"	      INTEGER,
    "hidden"	    TEXT NOT NULL DEFAULT 'false',
    PRIMARY KEY("id")
  )
`
).run()

// Create guilds table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "guilds" (
    "id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
    "name"	      TEXT NOT NULL,
    "creatorId"   INTEGER NOT NULL,
    "money"	      INTEGER NOT NULL,
    "reputation"	INTEGER NOT NULL,
    "wins"	      INTEGER NOT NULL,
    "loses"	      INTEGER NOT NULL,
    "shield"	    INTEGER,
    "timeout"	    INTEGER
  )
`
).run()

// Create guilds members table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "guildMembers" (
    "id"      	INTEGER NOT NULL,
    "guildId"	  INTEGER NOT NULL,
    "role"	    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY("id"),
    FOREIGN KEY("id") REFERENCES "users"("id") ON DELETE CASCADE,
    FOREIGN KEY("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE
  )
`
).run()

// Create guilds populations table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "guildPopulations" (
    "id"  	    INTEGER NOT NULL,
    "peasants"	INTEGER NOT NULL,
    "farmers"	  INTEGER NOT NULL,
    "warriors"  INTEGER NOT NULL,
    PRIMARY KEY("id"),
    FOREIGN KEY("id") REFERENCES "guilds"("id") ON DELETE CASCADE
  )
`
).run()

// Create items table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "items" (
    "userId"	  INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "id"	      INTEGER NOT NULL,
    "quantity"	INTEGER DEFAULT 0,
    FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE
  )
`
).run()

// Create earnings table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "earnings" (
    "userId"	INTEGER NOT NULL,
    "field"	  TEXT NOT NULL,
    "time"	  INTEGER NOT NULL,
    PRIMARY KEY("userId"),
    FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE
  )
`
).run()

// Create pets table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "pets" (
    "userId"	  INTEGER NOT NULL,
    "id"	      INTEGER NOT NULL,
    "timestamp"	INTEGER NOT NULL,
    PRIMARY KEY("userId"),
    FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE
  )
`
).run()

// Create dialogs table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "dialogs" (
    "id"	            INTEGER NOT NULL,
    "autoMailing"     INTEGER NOT NULL DEFAULT 1,
    "canReadMessages" INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY("id")
  )
`
).run()

// Add trigger add_guild_member
db.prepare(
  `
  CREATE TRIGGER IF NOT EXISTS add_guild_member BEFORE INSERT ON guildMembers 
  BEGIN 
    UPDATE users SET guild=(CASE WHEN NEW.role > 0 THEN NEW.guildId ELSE null END) WHERE id=NEW.id;
  END
`
).run()

// Add trigger delete_guild_member
db.prepare(
  `
  CREATE TRIGGER IF NOT EXISTS delete_guild_member AFTER DELETE ON guildMembers 
  BEGIN 
    UPDATE users SET guild=NULL WHERE id=OLD.id;
  END
`
).run()

// Add trigger init_guild_populations
db.prepare(
  `
  CREATE TRIGGER IF NOT EXISTS init_guild_populations BEFORE INSERT ON guilds
  BEGIN 
    INSERT INTO guildPopulations (id, peasants, farmers, warriors) VALUES (NEW.id, 0, 0, 0);
  END
`
).run()

export default db
