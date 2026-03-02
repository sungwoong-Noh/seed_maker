/**
 * 카테고리별 Lucide 아이콘 이름 매핑
 */
export const categoryIcons: Record<string, string> = {
  "식비": "utensils",
  "교통": "train",
  "문화": "film",
  "쇼핑": "shopping-bag",
  "의료": "activity",
  "기타": "package",
  // 기본값
  "default": "tag",
};

/**
 * 카테고리 이름으로 아이콘 이름 가져오기
 */
export function getCategoryIcon(categoryName: string): string {
  return categoryIcons[categoryName] || categoryIcons["default"];
}
