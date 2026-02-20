/**
 * 카테고리별 아이콘 매핑
 */
export const categoryIcons: Record<string, string> = {
  "식비": "🍽️",
  "교통": "🚇",
  "문화": "🎬",
  "쇼핑": "🛍️",
  "의료": "🏥",
  "기타": "📦",
  // 기본값
  "default": "📌",
};

/**
 * 카테고리 이름으로 아이콘 가져오기
 */
export function getCategoryIcon(categoryName: string): string {
  return categoryIcons[categoryName] || categoryIcons["default"];
}
