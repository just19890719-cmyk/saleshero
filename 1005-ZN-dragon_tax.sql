-- 社畜特攻隊 1005-ZN:芳芳收稅 → 射龍門池底
-- 在 Supabase → SQL Editor 貼上整段,按 Run 一次即可(重複執行也沒關係)

-- 1. 池底資料表加上「今日稅收」欄位
alter table public.dragon_pot
  add column if not exists tax_day date,
  add column if not exists tax_amt bigint not null default 0;

-- 2. 只能往池底「加錢」的函式;每次最多 50,000,負數一律當 0
create or replace function public.dragon_tax(p_amt bigint)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_amt bigint := least(greatest(coalesce(p_amt, 0), 0), 50000);
  v_day date   := (now() at time zone 'Asia/Taipei')::date;
  v_pot bigint;
  v_tax bigint;
begin
  if v_amt <= 0 then
    select pot, case when tax_day = v_day then tax_amt else 0 end
      into v_pot, v_tax from dragon_pot where id = 1;
  else
    update dragon_pot
       set pot     = pot + v_amt,
           tax_amt = case when tax_day = v_day then tax_amt + v_amt else v_amt end,
           tax_day = v_day
     where id = 1
     returning pot, tax_amt into v_pot, v_tax;
  end if;
  return json_build_object('pot', v_pot, 'tax', coalesce(v_tax, 0));
end;
$$;

revoke all on function public.dragon_tax(bigint) from public;
grant execute on function public.dragon_tax(bigint) to anon, authenticated;
