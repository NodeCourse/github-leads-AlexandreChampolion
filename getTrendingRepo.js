async function getMostRecentlyRepo {

  const query = 'created:2018-6-6..2018-6-6'

  const result = await octokit.search.repos({q:created:2018-6-8..2018-6-6});

  return result;
}

getMostRecentlyRepo();










































function getTrendingRepos({languages, created}) {
  return client
    .search
    .repos({

    })
}
