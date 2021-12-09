library(dplyr)

unique_games <- all_teams_tib %>% 
    select(game_id, team_id, team_name, htm, vtm, game_date) %>%
    distinct()

test_game <- unique_games %>%
    dplyr::filter(game_id == "0022100013")

matchups_left <- unique_games[!duplicated(unique_games$game_id),]
matchups_right <- unique_games[duplicated(unique_games$game_id),][1:3]

left_arranged <- matchups_left %>% 
    `colnames<-`(c("game_id", "team1_id", "team1_name", "htm", "vtm", "game_date"))
right_arranged <- matchups_right %>%
    `colnames<-`(c("game_id", "team2_id", "team2_name"))

matchups <- full_join(left_arranged, right_arranged, by= "game_id")


write.csv(matchups, "matchups.csv")


matchups <- read.csv("matchups.csv")
matchups_reverse <- matchups %>%
    select(X, game_id, team2_id, team2_name, htm, vtm, game_date, team1_id, team1_name) %>%
    `colnames<-`(c("X", "game_id", "team1_id", "team1_name", "htm", "vtm", "game_date", "team2_id", "team2_name"))

full_matchups <- rbind(matchups, matchups_reverse)[,-1]

matchups_json <- jsonlite::toJSON(full_matchups)
write(matchups_json, "matchups.json")


court_data <- read.csv('courtpoints.csv')

court_split <- split(court_data, court_data$desc)

write(jsonlite::toJSON(court_split), "courtpoints.json")

allshots <- read.csv("2021_season_aug_dec.csv")

shots_selected <- allshots %>%
    dplyr::select(game_id, player_name, team_name, period, minutes_remaining, seconds_remaining, event_type, action_type, shot_distance, fg_pct, loc_x, loc_y )

write(jsonlite::toJSON(shots_selected), "allshots.json")
