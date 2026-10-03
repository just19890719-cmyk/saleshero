-- 社畜英雄 雲端帳號「同一時間只能在一個地方登入」(在 Supabase 的 SQL Editor 貼上後按 Run,重複執行也沒關係,不會刪掉帳號或存檔)

-- 登入時只保留這一次的登入狀態,其他裝置會被踢下線
create or replace function public.acct_login(p_user text, p_pass text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare u text := lower(trim(coalesce(p_user, ''))); a accounts; tk text;
begin
  select * into a from accounts where username = u;
  if a.username is null or a.pass_hash <> crypt(coalesce(p_pass, ''), a.pass_hash) then
    perform pg_sleep(0.5); raise exception 'bad login';
  end if;
  tk := encode(gen_random_bytes(24), 'hex');
  update accounts set tokens = array[encode(digest(tk, 'sha256'), 'hex')], updated_at = now() where username = u;
  return json_build_object('user', u, 'token', tk, 'lb_id', a.lb_id, 'save', a.save, 'save_t', a.save_t);
end $$;

-- 檢查這台裝置是否還是目前登入中的那一台
create or replace function public.acct_ping(p_user text, p_token text)
returns boolean language sql security definer set search_path = public, extensions as $$
  select exists (select 1 from accounts where username = lower(trim(coalesce(p_user, '')))
                 and encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') = any(tokens))
$$;
grant execute on function public.acct_ping(text, text) to anon, authenticated;

notify pgrst, 'reload schema';
