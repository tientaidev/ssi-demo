import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { ManagedKeyInfo } from "@veramo/core";

export class VeramoDatabase {
    private async openDb() {
      return open({
        filename: 'database.sqlite',
        driver: sqlite3.Database,
      });
    }
  
    async getKeys(): Promise<ManagedKeyInfo[]> {
      let db;
      try {
        db = await this.openDb();
        const keys: ManagedKeyInfo[] = await db.all('SELECT * FROM key');
        return keys;
      } catch (error) {
        return error as any;
      } finally {
        if (db !== undefined) await db.close();
      }
    }
  }