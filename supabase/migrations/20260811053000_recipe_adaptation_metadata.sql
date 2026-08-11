alter table public.recipes
  add column adaptation_goal text check (adaptation_goal is null or adaptation_goal in ('healthier_overall', 'higher_protein', 'lower_calorie', 'lower_sodium')),
  add column taste_protection text check (taste_protection is null or taste_protection in ('nearly_identical', 'balanced', 'maximum_change'));

alter table public.recipes add constraint recipe_adaptation_pair_check
check ((adaptation_goal is null) = (taste_protection is null));
