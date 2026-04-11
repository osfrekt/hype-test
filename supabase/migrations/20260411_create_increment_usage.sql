create or replace function increment_usage(user_email text, usage_column text)
returns void as $$
begin
  if usage_column = 'research_count_this_month' then
    update users set research_count_this_month = research_count_this_month + 1, updated_at = now() where email = user_email;
  elsif usage_column = 'discovery_count_this_month' then
    update users set discovery_count_this_month = discovery_count_this_month + 1, updated_at = now() where email = user_email;
  end if;
end;
$$ language plpgsql;
