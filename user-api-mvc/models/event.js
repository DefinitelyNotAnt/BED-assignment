const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Event {
  constructor(EventID, EventName, EventDesc, EventStartTime, EventEndTime, EntryPrice, HostID) {
    this.EventID = EventID;
    this.EventName = EventName;
    this.EventDesc = EventDesc;
    this.EventStartTime = EventStartTime;
    this.EventEndTime = EventEndTime;
    this.EntryPrice = EntryPrice;
    this.HostID = HostID;
  }

  static async getAllEvents() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Events`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Event(row.EventID, row.EventName, row.EventDesc, row.EventStartTime, row.EventEndTime, row.EntryPrice, row.HostID)
    ); // Convert rows to Event objects
  }

  static async getEventById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Events WHERE EventID = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Event(
          result.recordset[0].id,
          result.recordset[0].EventName,
          result.recordset[0].EventDesc,
          result.recordset[0].EventStartTime, 
          result.recordset[0].EventEndTime, 
          result.recordset[0].EntryPrice,
          result.recordset[0].HostID
        )
      : null; // Handle event not found
  }
  static async createEvent(newEventData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Events (EventName, EventDesc, EventStartTime, EventEndTime, EntryPrice, HostID) VALUES (@EventName, @EventDesc, @EventStartTime, @EventEndTime, @EntryPrice, @HostID); SELECT SCOPE_IDENTITY() AS EventID;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("EventName", newEventData.EventName);
    request.input("EventDesc", newEventData.EventDesc);
    request.input("EventStartTime", newEventData.EventStartTime);
    request.input("EventEndTime", newEventData.EventEndTime);
    request.input("EntryPrice", newEventData.EntryPrice);
    request.input("HostID", newEventData.HostID);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created event using its ID
    return this.getEventById(result.recordset[0].id);
  }

  static async updateEvent(EventID, newEventData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Events SET EventName = @EventName, EventDesc = @EventDesc, EventStartTime = @EventStartTime, EventEndTime = @EventEndTime, EntryPrice = @EntryPrice, HostID = @HostID WHERE EventID = @EventID`; // Parameterized query

    const request = connection.request();
    request.input("EventID", EventID);
    request.input("EventName", newEventData.EventName);
    request.input("EventDesc", newEventData.EventDesc); 
    request.input("EventStartTime", newEventData.EventStartTime); 
    request.input("EventEndTime", newEventData.EventEndTime); 
    request.input("EntryPrice", newEventData.EntryPrice || null); // Handle optional fields
    request.input("HostID", newEventData.HostID); 

    await request.query(sqlQuery);

    connection.close();

    return this.getEventById(EventID); // returning the updated event data
  }

  static async deleteEvent(EventID) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Events WHERE EventID = @EventID`; // Parameterized query

    const request = connection.request();
    request.input("EventID", EventID);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Event;