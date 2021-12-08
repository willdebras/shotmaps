library(httr)
library(dplyrs)

request_headers = c(
  `Connection` = 'keep-alive',
  `Accept` = 'application/json, text/plain, */*',
  `x-nba-stats-token` = 'true',
  `X-NewRelic-ID` = 'VQECWF5UChAHUlNTBwgBVw==',
  `User-Agent` = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
  `x-nba-stats-origin` = 'stats',
  `Sec-Fetch-Site` = 'same-origin',
  `Sec-Fetch-Mode` = 'cors',
  `Referer` = 'https://stats.nba.com/players/leaguedashplayerbiostats/',
  `Accept-Encoding` = 'gzip, deflate, br',
  `Accept-Language` = 'en-US,en;q=0.9'
)

shots_by_team_date = function(team_id, date) {
  
  request = GET(
    "http://stats.nba.com/stats/shotchartdetail",
    query = list(
      PlayerID = 0,
      Season = "",
      SeasonType = "Regular Season",
      PlayerPosition = "",
      ContextMeasure = "FGA",
      DateFrom = date,
      DateTo = date,
      GameID = "",
      GameSegment = "",
      LastNGames = 0,
      LeagueID = "00",
      Location = "",
      Month = 0,
      OpponentTeamID = 0,
      Outcome = "",
      Period = 0,
      Position = "",
      RookieYear = "",
      SeasonSegment = "",
      TeamID = team_id,
      VsConference = "",
      VsDivision = ""
    ),
    add_headers(request_headers)
  )
  
  stop_for_status(request)
  
  data = content(request)
  
  raw_shots_data = data$resultSets[[1]]$rowSet
  col_names = tolower(as.character(data$resultSets[[1]]$headers))
  
  if (length(raw_shots_data) == 0) {
    shots = data.frame(
      matrix(nrow = 0, ncol = length(col_names))
    )
  } else {
    shots = data.frame(
      matrix(
        unlist(raw_shots_data),
        ncol = length(col_names),
        byrow = TRUE
      )
    )
  }
  
  shots = tbl_df(shots)
  names(shots) = col_names
  
  shots = mutate(shots,
                 loc_x = as.numeric(as.character(loc_x)) / 10,
                 loc_y = as.numeric(as.character(loc_y)) / 10 + hoop_center_y,
                 shot_distance = as.numeric(as.character(shot_distance)),
                 shot_made_numeric = as.numeric(as.character(shot_made_flag)),
                 shot_made_flag = factor(shot_made_flag, levels = c("1", "0"), labels = c("made", "missed")),
                 shot_attempted_flag = as.numeric(as.character(shot_attempted_flag)),
                 shot_value = ifelse(tolower(shot_type) == "3pt field goal", 3, 2),
                 game_date = as.Date(game_date, format = "%Y%m%d")
  )
  
  raw_league_avg_data = data$resultSets[[2]]$rowSet
  league_avg_names = tolower(as.character(data$resultSets[[2]]$headers))
  league_averages = tbl_df(data.frame(
    matrix(unlist(raw_league_avg_data), ncol = length(league_avg_names), byrow = TRUE)
  ))
  names(league_averages) = league_avg_names
  league_averages = mutate(league_averages,
                           fga = as.numeric(as.character(fga)),
                           fgm = as.numeric(as.character(fgm)),
                           fg_pct = as.numeric(as.character(fg_pct)),
                           shot_value = ifelse(shot_zone_basic %in% c("Above the Break 3", "Backcourt", "Left Corner 3", "Right Corner 3"), 3, 2)
  )
  
  return(list(player = shots, league_averages = league_averages))
}

shots_by_team_date_range = function(team_id, from, to) {
  
  request = GET(
    "http://stats.nba.com/stats/shotchartdetail",
    query = list(
      PlayerID = 0,
      Season = "",
      SeasonType = "Regular Season",
      PlayerPosition = "",
      ContextMeasure = "FGA",
      DateFrom = from,
      DateTo = to,
      GameID = "",
      GameSegment = "",
      LastNGames = 0,
      LeagueID = "00",
      Location = "",
      Month = 0,
      OpponentTeamID = 0,
      Outcome = "",
      Period = 0,
      Position = "",
      RookieYear = "",
      SeasonSegment = "",
      TeamID = team_id,
      VsConference = "",
      VsDivision = ""
    ),
    add_headers(request_headers)
  )
  
  stop_for_status(request)
  
  data = content(request)
  
  raw_shots_data = data$resultSets[[1]]$rowSet
  col_names = tolower(as.character(data$resultSets[[1]]$headers))
  
  if (length(raw_shots_data) == 0) {
    shots = data.frame(
      matrix(nrow = 0, ncol = length(col_names))
    )
  } else {
    shots = data.frame(
      matrix(
        unlist(raw_shots_data),
        ncol = length(col_names),
        byrow = TRUE
      )
    )
  }
  
  shots = tbl_df(shots)
  names(shots) = col_names
  
  shots = mutate(shots,
                 loc_x = as.numeric(as.character(loc_x)) / 10,
                 loc_y = as.numeric(as.character(loc_y)) / 10 + hoop_center_y,
                 shot_distance = as.numeric(as.character(shot_distance)),
                 shot_made_numeric = as.numeric(as.character(shot_made_flag)),
                 shot_made_flag = factor(shot_made_flag, levels = c("1", "0"), labels = c("made", "missed")),
                 shot_attempted_flag = as.numeric(as.character(shot_attempted_flag)),
                 shot_value = ifelse(tolower(shot_type) == "3pt field goal", 3, 2),
                 game_date = as.Date(game_date, format = "%Y%m%d")
  )
  
  raw_league_avg_data = data$resultSets[[2]]$rowSet
  league_avg_names = tolower(as.character(data$resultSets[[2]]$headers))
  league_averages = tbl_df(data.frame(
    matrix(unlist(raw_league_avg_data), ncol = length(league_avg_names), byrow = TRUE)
  ))
  names(league_averages) = league_avg_names
  league_averages = mutate(league_averages,
                           fga = as.numeric(as.character(fga)),
                           fgm = as.numeric(as.character(fgm)),
                           fg_pct = as.numeric(as.character(fg_pct)),
                           shot_value = ifelse(shot_zone_basic %in% c("Above the Break 3", "Backcourt", "Left Corner 3", "Right Corner 3"), 3, 2)
  )
  
  return(list(player = shots, league_averages = league_averages))
}

get_game_full <- function(team_id, date) {
  
  df <- shots_by_team_date(team_id, date)
  
  shots <- as.data.frame(df[1])
  league_averages <- as.data.frame(df[2])
  
  
  names(shots) <- sub(".*\\.", "", names(shots))
  names(league_averages) <- sub(".*\\.", "", names(league_averages))
  
  df_joined <- left_join(shots, league_averages[2:7], by = c("shot_zone_basic", "shot_zone_area", "shot_zone_range"))
  
  return(df_joined)
  
}

get_season_full <- function(team_id, from, to) {
  
  df <- shots_by_team_date_range(team_id, from, to)
  
  shots <- as.data.frame(df[1])
  league_averages <- as.data.frame(df[2])
  
  
  names(shots) <- sub(".*\\.", "", names(shots))
  names(league_averages) <- sub(".*\\.", "", names(league_averages))
  
  df_joined <- left_join(shots, league_averages[2:7], by = c("shot_zone_basic", "shot_zone_area", "shot_zone_range"))
  
  return(df_joined)
  
}

knicks_ex <- get_game_full(1610612752, "2021-05-09")

write.csv(knicks_ex, "knicks_05_09.csv", row.names = F)

knicks_season <- get_season_full(1610612752, "2021-08-02", "2021-12-07")

write.csv(knicks_season, "knicks_aug_dec.csv", row.names = F)

all_teams <- lapply(all_team_ids$team_id, function(x) get_season_full(x, "2021-08-02", "2021-12-07"))


all_teams_tib <- do.call(rbind, all_teams)

write.csv(all_teams_tib, "2021_season_aug_dec.csv", row.names = F)
