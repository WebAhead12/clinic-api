import db from "../database/connection";
import fetchSurveyData from "../services/survey.service";
import moment from "moment";

export function fetchClients() {
  return db.query("SELECT * FROM clients").then((clients) => {
    return clients.rows;
  });
}

export function fetchSurveysByProtocolId(protocolId) {
  return db
    .query(
      "SELECT * FROM protocols_surveys ps INNER JOIN surveys ON surveys.id = ps.survey_id WHERE ps.protocol_id = $1",
      [protocolId]
    )
    .then((surveys) => surveys.rows);
}

export function attachSurveysToClient(
  protocolId,
  clientId,
  treatmentId,
  startDate
) {
  return fetchSurveysByProtocolId(protocolId).then((surveys) => {
    surveys.forEach(async (survey) => {
      let formattedSurvey = await fetchSurveyData(survey.survey_id);
      let surveyDate = moment(startDate).add({ weeks: +survey.week });
      return db.query(
        `INSERT INTO clients_surveys (client_id,survey_id,treatment_id,survey_snapshot,survey_date)
                VALUES ($1,$2,$3,$4,$5)`,
        [
          clientId,
          survey.id,
          treatmentId,
          JSON.stringify(formattedSurvey),
          surveyDate,
        ]
      );
    });
  });
}

export function createTreatment(clientId, protocolId, startDate, reminders) {
  const treatment = [
    clientId,
    protocolId,
    startDate,
    JSON.stringify(reminders),
  ];
  return db
    .query(
      `INSERT INTO treatment (client_id,protocol_id,start_date,reminders) 
    VALUES ($1,$2,$3,$4) RETURNING id`,
      treatment
    )
    .then(({ rows }) => rows[0].id);
}

//create client
export function addClient(client) {
  const user = [
    client.passcode,
    client.govId,
    client.condition,
    client.phone,
    client.email,
    client.name,
    client.gender,
  ];

  return db
    .query(
      `INSERT INTO clients 
      (passcode,gov_id,condition,phone,email,name,gender) 
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`,
      user
    )
    .then(({ rows }) => {
      return rows[0].id;
    });
}

//fetch client

export function getClient(data) {
  return db
    .query("SELECT * FROM clients WHERE gov_id = $1", [data])
    .then((client) => {
      return client.rows;
    });
}
