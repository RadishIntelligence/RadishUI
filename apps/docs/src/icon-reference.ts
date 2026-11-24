import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Boxes, Check, ChevronDown, ChevronLeft, Code2, Compass, Copy, FileText, FolderOpen, History, Info, Layers, LifeBuoy, ListChecks, ListTree, LockKeyhole, MoreHorizontal, Package, Palette, PanelLeftClose, PanelLeftOpen, PanelsTopLeft, Pencil, Plus, RefreshCw, Search, Share2, Shapes, ShieldCheck, SlidersHorizontal, Sparkles, Star, SunMoon, Trash2 } from 'lucide-react';

export type IconReferenceGroup = 'navigation' | 'action' | 'status' | 'content' | 'decoration';

export interface IconReferenceEntry {
  /** lucide-react 的导出名；`test:workbench` 校验它存在且与导入的组件一致。 */
  name: string;
  Icon: LucideIcon;
  group: IconReferenceGroup;
  zh: string;
  en: string;
}

export const iconReferenceGroups: readonly IconReferenceGroup[] = ['navigation', 'action', 'status', 'content', 'decoration'];

/** 图标用途分组的显示文案；图标页与站点搜索共用同一来源。 */
export const iconReferenceGroupLabels: Record<IconReferenceGroup, { zh: string; en: string }> = {
  navigation: { zh: '导航', en: 'Navigation' },
  action: { zh: '操作', en: 'Actions' },
  status: { zh: '状态', en: 'Status' },
  content: { zh: '内容与入口', en: 'Content & entries' },
  decoration: { zh: '装饰与提示', en: 'Decor & hints' },
};

/**
 * 展示站与组件示例实际使用的图标。图标沿用 lucide-react，不引入第二套图标依赖；
 * 尺寸沿用 16 / 18 / 20，颜色消费当前文字色，纯装饰图标对辅助技术隐藏。
 */
export const iconReference: readonly IconReferenceEntry[] = [
  { name: 'ArrowLeft', Icon: ArrowLeft, group: 'navigation', zh: '返回 / 上一级', en: 'Back / previous' },
  { name: 'ArrowRight', Icon: ArrowRight, group: 'navigation', zh: '前进 / 继续', en: 'Next / continue' },
  { name: 'ArrowUpRight', Icon: ArrowUpRight, group: 'navigation', zh: '外链 / 打开', en: 'External link / open' },
  { name: 'ChevronDown', Icon: ChevronDown, group: 'navigation', zh: '展开菜单', en: 'Expand menu' },
  { name: 'ChevronLeft', Icon: ChevronLeft, group: 'navigation', zh: '返回资源库', en: 'Back to library' },
  { name: 'Compass', Icon: Compass, group: 'navigation', zh: '概览', en: 'Overview' },
  { name: 'FolderOpen', Icon: FolderOpen, group: 'navigation', zh: '资源库', en: 'Resources' },
  { name: 'ListTree', Icon: ListTree, group: 'navigation', zh: '页面目录', en: 'Page outline' },
  { name: 'PanelLeftClose', Icon: PanelLeftClose, group: 'navigation', zh: '收起侧栏', en: 'Collapse sidebar' },
  { name: 'PanelLeftOpen', Icon: PanelLeftOpen, group: 'navigation', zh: '展开侧栏', en: 'Expand sidebar' },
  { name: 'Shapes', Icon: Shapes, group: 'navigation', zh: '图标参考', en: 'Icon reference' },
  { name: 'BookOpen', Icon: BookOpen, group: 'content', zh: '文档入口', en: 'Documentation' },
  { name: 'Copy', Icon: Copy, group: 'action', zh: '复制', en: 'Copy' },
  { name: 'Pencil', Icon: Pencil, group: 'action', zh: '编辑', en: 'Edit' },
  { name: 'Plus', Icon: Plus, group: 'action', zh: '新增', en: 'Add' },
  { name: 'RefreshCw', Icon: RefreshCw, group: 'action', zh: '刷新 / 恢复', en: 'Refresh / restore' },
  { name: 'Share2', Icon: Share2, group: 'action', zh: '分享', en: 'Share' },
  { name: 'Search', Icon: Search, group: 'action', zh: '搜索', en: 'Search' },
  { name: 'Trash2', Icon: Trash2, group: 'action', zh: '删除', en: 'Delete' },
  { name: 'MoreHorizontal', Icon: MoreHorizontal, group: 'action', zh: '更多操作', en: 'More actions' },
  { name: 'Check', Icon: Check, group: 'status', zh: '成功 / 选中', en: 'Success / selected' },
  { name: 'Info', Icon: Info, group: 'status', zh: '提示', en: 'Info' },
  { name: 'LockKeyhole', Icon: LockKeyhole, group: 'status', zh: '只读 / 锁定', en: 'Read only / locked' },
  { name: 'ShieldCheck', Icon: ShieldCheck, group: 'status', zh: '权限 / 安全', en: 'Permission / security' },
  { name: 'FileText', Icon: FileText, group: 'content', zh: '文档', en: 'Document' },
  { name: 'ListChecks', Icon: ListChecks, group: 'content', zh: '清单', en: 'Checklist' },
  { name: 'Palette', Icon: Palette, group: 'content', zh: '视觉基础 / 配色', en: 'Foundations / palette' },
  { name: 'PanelsTopLeft', Icon: PanelsTopLeft, group: 'content', zh: '范例页面', en: 'Example page' },
  { name: 'Code2', Icon: Code2, group: 'content', zh: '代码 / React', en: 'Code / React' },
  { name: 'Layers', Icon: Layers, group: 'content', zh: '层 / Flutter 预留', en: 'Layer / Flutter reserved' },
  { name: 'Package', Icon: Package, group: 'content', zh: '平台与接入', en: 'Platforms' },
  { name: 'Boxes', Icon: Boxes, group: 'content', zh: '组件目录', en: 'Component catalog' },
  { name: 'History', Icon: History, group: 'content', zh: '版本 / 变更记录', en: 'Versions / changelog' },
  { name: 'LifeBuoy', Icon: LifeBuoy, group: 'content', zh: '帮助与反馈', en: 'Help & feedback' },
  { name: 'SlidersHorizontal', Icon: SlidersHorizontal, group: 'content', zh: '偏好设置', en: 'Preferences' },
  { name: 'SunMoon', Icon: SunMoon, group: 'decoration', zh: '明暗外观', en: 'Light / dark appearance' },
  { name: 'Star', Icon: Star, group: 'decoration', zh: '收藏', en: 'Favorite' },
  { name: 'Sparkles', Icon: Sparkles, group: 'decoration', zh: '新特性 / 高亮', en: 'Highlights' },
];
