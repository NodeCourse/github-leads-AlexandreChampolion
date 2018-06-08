const program = require('commander');
const octokit = require('./client');
const flatten = require('flatten-array');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//Query for getMostRecentlyRepo
let query = 'language javascript created:2018-06-06..2018-06-08 stars:>1'

program
  .version('0.1.0')
  .option('-t, --token [token]', 'GitHub Token')
  .option('-l, --language', 'Language')
  .parse(process.argv)

  if (program.token){
    octokit.authenticate({
      type: 'token',
      token: program.token
  });
}

async function getMostRecentlyRepo() {
  let items = [];
  let userList = [];

  let result = await octokit.search.repos({q:query});

  items = result.data.items;

  flatten(await Promise.all(items.map(async function (t){

    userList = await octokit.activity.getStargazersForRepo({owner: t.owner.login, repo: t.name});
    userList = userList.data.map(function (user){
      return user.user;
    });

    return userList
  })));

  const csvWriter = createCsvWriter({
    path: 'file.csv',
    header: [
        {id: 'login', title: 'login'},
        {id: 'html_url', title: 'repo'},
    ]
  });

  csvWriter.writeRecords(userList)
    .then(() => {
        console.log('...Done');
    });
}

getMostRecentlyRepo();
