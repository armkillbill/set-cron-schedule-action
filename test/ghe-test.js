const { readFileSync } = require("fs");

const nock = require("nock");
const main = require("../lib/main");

nock.cleanAll();
nock.disableNetConnect();

process.env = {
  ...process.env,
  GITHUB_REPOSITORY: "gr2m/set-cron-schedule-action",
  GITHUB_WORKFLOW: "Reminder",
  INPUT_TOKEN: "secret",
  INPUT_CRON: "1 19 14 6 *",
  GITHUB_API_URL: "https://ghe.github.com/api/v3"
};

nock("https://ghe.github.com/api/v3", {
  reqheaders: {
    authorization: "token secret",
  },
})
  .get("/repos/gr2m/set-cron-schedule-action/actions/workflows")
  .reply(200, [
    {
      name: "Reminder",
      path: ".github/workflows/reminder.yml",
    },
  ])

  .get(
    "/repos/gr2m/set-cron-schedule-action/contents/.github%2Fworkflows%2Freminder.yml"
  )
  .reply(200, {
    content: readFileSync("./test/fixtures/reminder.yml", "base64"),
    sha: "sha123",
  })

  .put(
    "/repos/gr2m/set-cron-schedule-action/contents/.github%2Fworkflows%2Freminder.yml",
    {
      content: readFileSync("./test/fixtures/reminder-updated.yml", "base64"),
      message: "ci(Reminder): update cron schedule: 1 19 14 6 *",
      sha: "sha123",
    }
  )
  .reply(201);

module.exports = main();
