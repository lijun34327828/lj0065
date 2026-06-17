import { useState } from 'react';
import { useBanquetStore, computeSegmentTimes } from '@/store/useBanquetStore';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
  Plus,
  X,
  Check,
  RefreshCw,
  Megaphone,
  Mic2,
  Utensils,
  Music,
  Gift,
  HandMetal,
  Sparkles,
  Star,
} from 'lucide-react';
import type { TimelineSegmentType, TimelineSegment } from '@/types/banquet';

const segmentTypeConfig: Record<TimelineSegmentType, { label: string; color: string; bg: string; icon: any }> = {
  welcome: { label: '迎宾', color: 'text-blue-700', bg: 'bg-blue-100', icon: HandMetal },
  opening: { label: '开场', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: Megaphone },
  speech: { label: '致辞', color: 'text-purple-700', bg: 'bg-purple-100', icon: Mic2 },
  dish: { label: '上菜', color: 'text-amber-700', bg: 'bg-amber-100', icon: Utensils },
  entertainment: { label: '娱乐', color: 'text-pink-700', bg: 'bg-pink-100', icon: Music },
  lottery: { label: '抽奖', color: 'text-gold-600', bg: 'bg-gold-100', icon: Gift },
  farewell: { label: '送客', color: 'text-teal-700', bg: 'bg-teal-100', icon: Sparkles },
  custom: { label: '自定义', color: 'text-ink-500', bg: 'bg-ink-100', icon: Star },
};

const segmentTypeOptions: { value: TimelineSegmentType; label: string }[] = [
  { value: 'welcome', label: '迎宾' },
  { value: 'opening', label: '开场' },
  { value: 'speech', label: '致辞' },
  { value: 'dish', label: '上菜' },
  { value: 'entertainment', label: '娱乐' },
  { value: 'lottery', label: '抽奖' },
  { value: 'farewell', label: '送客' },
  { value: 'custom', label: '自定义' },
];

interface EditingState {
  segmentId: string;
  type: TimelineSegmentType;
  label: string;
  durationMinutes: number;
  note: string;
}

interface AddingState {
  type: TimelineSegmentType;
  label: string;
  durationMinutes: number;
  note: string;
}

export default function TimelineView() {
  const {
    getSelectedPlan,
    generateTimeline,
    addTimelineSegment,
    updateTimelineSegment,
    removeTimelineSegment,
    moveTimelineSegment,
    setTimelineStartTime,
  } = useBanquetStore();

  const selectedPlan = getSelectedPlan();
  const timeline = selectedPlan?.timeline;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingState | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<AddingState>({
    type: 'custom',
    label: '',
    durationMinutes: 15,
    note: '',
  });
  const [isOpen, setIsOpen] = useState(true);

  if (!selectedPlan) return null;

  if (!timeline) {
    return (
      <div className="bg-white/70 rounded-xl border border-gold-200/40 overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-wine-500 to-wine-700 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-ink-600">宴会当天流程时间轴</h3>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={generateTimeline}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            生成时间轴
          </button>
        </div>
      </div>
    );
  }

  const times = computeSegmentTimes(timeline);

  function handleStartEdit(seg: TimelineSegment) {
    setEditingId(seg.id);
    setEditForm({
      segmentId: seg.id,
      type: seg.type,
      label: seg.label,
      durationMinutes: seg.durationMinutes,
      note: seg.note,
    });
  }

  function handleSaveEdit() {
    if (!editForm) return;
    updateTimelineSegment(editForm.segmentId, {
      type: editForm.type,
      label: editForm.label,
      durationMinutes: editForm.durationMinutes,
      note: editForm.note,
    });
    setEditingId(null);
    setEditForm(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function handleAdd() {
    addTimelineSegment({
      type: addForm.type,
      label: addForm.label || segmentTypeConfig[addForm.type].label,
      durationMinutes: addForm.durationMinutes,
      note: addForm.note,
    });
    setIsAdding(false);
    setAddForm({ type: 'custom', label: '', durationMinutes: 15, note: '' });
  }

  function handleCancelAdd() {
    setIsAdding(false);
    setAddForm({ type: 'custom', label: '', durationMinutes: 15, note: '' });
  }

  return (
    <div className="bg-white/70 rounded-xl border border-gold-200/40 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gold-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-wine-500 to-wine-700 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-ink-600">宴会当天流程时间轴</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-ink-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ink-400" />
        )}
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-500">开始时间:</span>
              <input
                type="number"
                min={0}
                max={23}
                value={timeline.startHour}
                onChange={e => setTimelineStartTime(parseInt(e.target.value) || 0, timeline.startMinute)}
                className="w-14 px-2 py-1 text-center border border-gold-200 rounded-lg bg-ivory-50 text-wine-800 font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <span className="text-ink-500 font-bold">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={timeline.startMinute}
                onChange={e => setTimelineStartTime(timeline.startHour, parseInt(e.target.value) || 0)}
                className="w-14 px-2 py-1 text-center border border-gold-200 rounded-lg bg-ivory-50 text-wine-800 font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <button
              onClick={generateTimeline}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-wine-50 text-wine-600 rounded-lg hover:bg-wine-100 transition-colors border border-wine-200/50"
              title="重新生成时间轴"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新生成
            </button>
          </div>

          <div className="relative">
            {timeline.segments.map((seg, i) => {
              const config = segmentTypeConfig[seg.type];
              const TypeIcon = config.icon;
              const isEditing = editingId === seg.id;
              const isLast = i === timeline.segments.length - 1;

              return (
                <div key={seg.id} className="flex gap-3">
                  <div className="flex flex-col items-center w-12 shrink-0">
                    <span className="text-xs font-mono text-wine-600 mb-1">
                      {times[i]?.startTime}
                    </span>
                    <div className="w-3 h-3 rounded-full bg-gold-500 border-2 border-wine-600 shrink-0 z-10" />
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-gold-400 to-gold-200" />
                    )}
                  </div>

                  <div className={`flex-1 ${isLast ? '' : 'pb-3'}`}>
                    {isEditing && editForm ? (
                      <div className="p-4 bg-gradient-to-br from-ivory-50 to-white rounded-lg border-2 border-gold-400 shadow-gold">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-ink-400 mb-1 block">环节类型</label>
                            <select
                              value={editForm.type}
                              onChange={e => setEditForm({ ...editForm, type: e.target.value as TimelineSegmentType })}
                              className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                            >
                              {segmentTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-ink-400 mb-1 block">时长（分钟）</label>
                            <input
                              type="number"
                              min={1}
                              value={editForm.durationMinutes}
                              onChange={e => setEditForm({ ...editForm, durationMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                              className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs text-ink-400 mb-1 block">环节名称</label>
                          <input
                            type="text"
                            value={editForm.label}
                            onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="text-xs text-ink-400 mb-1 block">备注</label>
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                            placeholder="选填备注信息"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-wine-600 text-white text-sm rounded-lg hover:bg-wine-700 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            保存
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-ink-100 text-ink-600 text-sm rounded-lg hover:bg-ink-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-3 bg-gradient-to-br from-ivory-50 to-white rounded-lg border border-gold-200/50 group hover:border-gold-300 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${config.bg} ${config.color}`}>
                                <TypeIcon className="w-3 h-3" />
                                {config.label}
                              </span>
                              <span className="font-semibold text-wine-800">{seg.label}</span>
                              <span className="text-sm text-ink-400">{seg.durationMinutes}分钟</span>
                            </div>
                            {seg.note && (
                              <p className="text-sm text-ink-500 ml-1">{seg.note}</p>
                            )}
                            <div className="text-xs text-ink-400 mt-1 ml-1">
                              {times[i]?.startTime} - {times[i]?.endTime}
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(seg)}
                            className="p-1.5 rounded-lg bg-wine-100 text-wine-600 hover:bg-wine-200 transition-colors"
                            title="编辑"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveTimelineSegment(seg.id, 'up')}
                            disabled={i === 0}
                            className="p-1.5 rounded-lg bg-gold-100 text-gold-700 hover:bg-gold-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="上移"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveTimelineSegment(seg.id, 'down')}
                            disabled={isLast}
                            className="p-1.5 rounded-lg bg-gold-100 text-gold-700 hover:bg-gold-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="下移"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeTimelineSegment(seg.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                            title="删除"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isAdding ? (
            <div className="mt-3 p-4 bg-gradient-to-br from-ivory-50 to-white rounded-lg border-2 border-dashed border-gold-400">
              <h4 className="text-sm font-semibold text-wine-700 mb-3">新增环节</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">环节类型</label>
                  <select
                    value={addForm.type}
                    onChange={e => {
                      const newType = e.target.value as TimelineSegmentType;
                      setAddForm({
                        ...addForm,
                        type: newType,
                        label: addForm.label || segmentTypeConfig[newType].label,
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {segmentTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">时长（分钟）</label>
                  <input
                    type="number"
                    min={1}
                    value={addForm.durationMinutes}
                    onChange={e => setAddForm({ ...addForm, durationMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-ink-400 mb-1 block">环节名称</label>
                <input
                  type="text"
                  value={addForm.label}
                  onChange={e => setAddForm({ ...addForm, label: e.target.value })}
                  placeholder={segmentTypeConfig[addForm.type].label}
                  className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div className="mb-3">
                <label className="text-xs text-ink-400 mb-1 block">备注</label>
                <input
                  type="text"
                  value={addForm.note}
                  onChange={e => setAddForm({ ...addForm, note: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gold-200 rounded-lg bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  placeholder="选填备注信息"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1 px-3 py-1.5 bg-wine-600 text-white text-sm rounded-lg hover:bg-wine-700 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  确认添加
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex items-center gap-1 px-3 py-1.5 bg-ink-100 text-ink-600 text-sm rounded-lg hover:bg-ink-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 w-full py-3 border-2 border-dashed border-gold-300 rounded-lg text-gold-600 hover:border-gold-500 hover:bg-gold-50/50 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-medium">新增环节</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
