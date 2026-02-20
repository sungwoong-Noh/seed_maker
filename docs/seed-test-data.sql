-- ============================================================
-- Seed Maker 과거 테스트 데이터 삽입
-- Supabase SQL Editor에서 실행
-- ============================================================
-- 1. 아래 MY_USER_ID를 본인 user_id로 변경하세요.
--    (auth.users 테이블에서 확인: SELECT id, email FROM auth.users;)
-- 2. categories ID가 필요하면: SELECT id, name FROM categories;
-- ============================================================

-- [필수] 여기에 본인 user_id(uuid)를 넣으세요
-- 예: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
DO $$
DECLARE
  v_user_id uuid;
  v_cat_식비 uuid;
  v_cat_교통 uuid;
  v_cat_공과금 uuid;
  v_cat_쇼핑 uuid;
  v_cat_의료 uuid;
  v_cat_기타 uuid;
  v_ym text;
  v_i int;
BEGIN
  -- 본인 이메일로 user_id 조회 (이메일 수정 후 사용)
  -- 아래 이메일을 본인 계정으로 변경하세요
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id를 찾을 수 없습니다. YOUR_EMAIL@example.com 을 실제 이메일로 바꾸세요.';
  END IF;

  -- 카테고리 ID 조회
  SELECT id INTO v_cat_식비 FROM categories WHERE name = '식비' LIMIT 1;
  SELECT id INTO v_cat_교통 FROM categories WHERE name = '교통' LIMIT 1;
  SELECT id INTO v_cat_공과금 FROM categories WHERE name = '공과금' LIMIT 1;
  SELECT id INTO v_cat_쇼핑 FROM categories WHERE name = '쇼핑' LIMIT 1;
  SELECT id INTO v_cat_의료 FROM categories WHERE name = '의료' LIMIT 1;
  SELECT id INTO v_cat_기타 FROM categories WHERE name = '기타' LIMIT 1;

  -- ========== 과거 6개월 예산 (2025-09 ~ 2026-02) ==========
  -- 월별 예산: 식비 40만, 교통 10만, 공과금 15만, 쇼핑 20만, 의료 5만, 기타 10만 = 100만
  INSERT INTO budgets (user_id, year_month, category_id, amount) VALUES
    (v_user_id, '2025-09', v_cat_식비, 400000),
    (v_user_id, '2025-09', v_cat_교통, 100000),
    (v_user_id, '2025-09', v_cat_공과금, 150000),
    (v_user_id, '2025-09', v_cat_쇼핑, 200000),
    (v_user_id, '2025-09', v_cat_의료, 50000),
    (v_user_id, '2025-09', v_cat_기타, 100000),
    (v_user_id, '2025-10', v_cat_식비, 400000),
    (v_user_id, '2025-10', v_cat_교통, 100000),
    (v_user_id, '2025-10', v_cat_공과금, 150000),
    (v_user_id, '2025-10', v_cat_쇼핑, 200000),
    (v_user_id, '2025-10', v_cat_의료, 50000),
    (v_user_id, '2025-10', v_cat_기타, 100000),
    (v_user_id, '2025-11', v_cat_식비, 400000),
    (v_user_id, '2025-11', v_cat_교통, 100000),
    (v_user_id, '2025-11', v_cat_공과금, 150000),
    (v_user_id, '2025-11', v_cat_쇼핑, 200000),
    (v_user_id, '2025-11', v_cat_의료, 50000),
    (v_user_id, '2025-11', v_cat_기타, 100000),
    (v_user_id, '2025-12', v_cat_식비, 400000),
    (v_user_id, '2025-12', v_cat_교통, 100000),
    (v_user_id, '2025-12', v_cat_공과금, 150000),
    (v_user_id, '2025-12', v_cat_쇼핑, 200000),
    (v_user_id, '2025-12', v_cat_의료, 50000),
    (v_user_id, '2025-12', v_cat_기타, 100000),
    (v_user_id, '2026-01', v_cat_식비, 400000),
    (v_user_id, '2026-01', v_cat_교통, 100000),
    (v_user_id, '2026-01', v_cat_공과금, 150000),
    (v_user_id, '2026-01', v_cat_쇼핑, 200000),
    (v_user_id, '2026-01', v_cat_의료, 50000),
    (v_user_id, '2026-01', v_cat_기타, 100000),
    (v_user_id, '2026-02', v_cat_식비, 400000),
    (v_user_id, '2026-02', v_cat_교통, 100000),
    (v_user_id, '2026-02', v_cat_공과금, 150000),
    (v_user_id, '2026-02', v_cat_쇼핑, 200000),
    (v_user_id, '2026-02', v_cat_의료, 50000),
    (v_user_id, '2026-02', v_cat_기타, 100000)
  ON CONFLICT (user_id, year_month, category_id) DO UPDATE SET amount = EXCLUDED.amount;

  -- ========== 과거 6개월 지출 (씨앗돈 트렌드용) ==========
  -- 씨앗돈 = 예산 - 실지출 (절약액)
  -- 2025-09: 절약 15만 (지출 85만) -> 그래프 상단
  -- 2025-10: 절약 8만  (지출 92만)
  -- 2025-11: 절약 3만  (지출 97만)
  -- 2025-12: 절약 20만 (지출 80만)
  -- 2026-01: 절약 10만 (지출 90만)
  -- 2026-02: 절약 5만  (지출 95만)
  INSERT INTO expenses (user_id, amount, category_id, spent_at, memo) VALUES
    -- 2025-09: 총 지출 85만 (씨앗 15만)
    (v_user_id, 350000, v_cat_식비, '2025-09-05', '장보기'),
    (v_user_id, 80000, v_cat_교통, '2025-09-10', '교통비'),
    (v_user_id, 140000, v_cat_공과금, '2025-09-15', '공과금'),
    (v_user_id, 180000, v_cat_쇼핑, '2025-09-20', '쇼핑'),
    (v_user_id, 30000, v_cat_의료, '2025-09-22', '약'),
    (v_user_id, 70000, v_cat_기타, '2025-09-28', '기타'),
    -- 2025-10: 총 지출 92만 (씨앗 8만)
    (v_user_id, 380000, v_cat_식비, '2025-10-03', '장보기'),
    (v_user_id, 95000, v_cat_교통, '2025-10-12', '교통비'),
    (v_user_id, 145000, v_cat_공과금, '2025-10-14', '공과금'),
    (v_user_id, 195000, v_cat_쇼핑, '2025-10-18', '쇼핑'),
    (v_user_id, 45000, v_cat_의료, '2025-10-25', '병원'),
    (v_user_id, 85000, v_cat_기타, '2025-10-30', '기타'),
    -- 2025-11: 총 지출 97만 (씨앗 3만)
    (v_user_id, 390000, v_cat_식비, '2025-11-02', '장보기'),
    (v_user_id, 98000, v_cat_교통, '2025-11-08', '교통비'),
    (v_user_id, 148000, v_cat_공과금, '2025-11-15', '공과금'),
    (v_user_id, 198000, v_cat_쇼핑, '2025-11-22', '쇼핑'),
    (v_user_id, 48000, v_cat_의료, '2025-11-25', '의료'),
    (v_user_id, 88000, v_cat_기타, '2025-11-28', '기타'),
    -- 2025-12: 총 지출 80만 (씨앗 20만)
    (v_user_id, 320000, v_cat_식비, '2025-12-05', '장보기'),
    (v_user_id, 75000, v_cat_교통, '2025-12-10', '교통비'),
    (v_user_id, 130000, v_cat_공과금, '2025-12-15', '공과금'),
    (v_user_id, 160000, v_cat_쇼핑, '2025-12-20', '쇼핑'),
    (v_user_id, 35000, v_cat_의료, '2025-12-22', '의료'),
    (v_user_id, 80000, v_cat_기타, '2025-12-28', '기타'),
    -- 2026-01: 총 지출 90만 (씨앗 10만)
    (v_user_id, 365000, v_cat_식비, '2026-01-04', '장보기'),
    (v_user_id, 90000, v_cat_교통, '2026-01-10', '교통비'),
    (v_user_id, 142000, v_cat_공과금, '2026-01-14', '공과금'),
    (v_user_id, 185000, v_cat_쇼핑, '2026-01-18', '쇼핑'),
    (v_user_id, 40000, v_cat_의료, '2026-01-25', '의료'),
    (v_user_id, 78000, v_cat_기타, '2026-01-30', '기타'),
    -- 2026-02: 총 지출 95만 (씨앗 5만)
    (v_user_id, 385000, v_cat_식비, '2026-02-02', '장보기'),
    (v_user_id, 98000, v_cat_교통, '2026-02-08', '교통비'),
    (v_user_id, 146000, v_cat_공과금, '2026-02-14', '공과금'),
    (v_user_id, 196000, v_cat_쇼핑, '2026-02-18', '쇼핑'),
    (v_user_id, 47000, v_cat_의료, '2026-02-22', '의료'),
    (v_user_id, 82000, v_cat_기타, '2026-02-25', '기타');

  RAISE NOTICE '테스트 데이터 삽입 완료. user_id: %', v_user_id;
END $$;
