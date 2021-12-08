View(all_teams_tib)

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
