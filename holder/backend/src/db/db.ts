import sqlite3 from "sqlite3";
import { open } from "sqlite";

export class VeramoDatabase {
    private async openDb() {
      return open({
        filename: 'database.sqlite',
        driver: sqlite3.Database,
      });
    }
  
    async deleteCredential(hash: string): Promise<boolean> {
      let db;
      try {
        db = await this.openDb();
        await db.exec(`DELETE FROM credential WHERE hash='${hash}'`);
        return true;
      } catch (error) {
        return error as any;
      } finally {
        if (db !== undefined) await db.close();
      }
    }
  }