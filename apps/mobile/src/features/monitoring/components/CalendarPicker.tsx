import React, { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { getTodayStr } from '@xross/core';
import { cn } from '@xross/core';

interface Props {
  visible: boolean;
  selected: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function pad(n: number) { return String(n).padStart(2, '0'); }

export function CalendarPicker({ visible, selected, onSelect, onClose }: Props) {
  const today = getTodayStr();
  const [year, setYear] = useState(() => Number(selected.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(selected.slice(5, 7)) - 1);

  const [ty, tm] = today.split('-').map(Number);
  const isNextDisabled = year === ty && month === tm - 1;

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const cells: (string | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      `${year}-${pad(month + 1)}-${pad(i + 1)}`
    ),
  ];

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (isNextDisabled) return;
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/60"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-[280px] bg-monitor-card-bg rounded-2xl border border-monitor-border p-4"
          style={{ shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } }}
        >
          {/* 월 내비게이션 */}
          <View className="flex-row items-center justify-between mb-3">
            <Pressable onPress={prevMonth} className="w-7 h-7 items-center justify-center rounded-md">
              <Ionicons name="chevron-back" size={14} color={colors.monitor['text-muted']} />
            </Pressable>
            <Text className="text-13 font-semibold text-monitor-text">
              {year}년 {month + 1}월
            </Text>
            <Pressable
              onPress={nextMonth}
              disabled={isNextDisabled}
              className={cn('w-7 h-7 items-center justify-center rounded-md', isNextDisabled && 'opacity-30')}
            >
              <Ionicons name="chevron-forward" size={14} color={colors.monitor['text-muted']} />
            </Pressable>
          </View>

          {/* 요일 헤더 */}
          <View className="flex-row mb-1">
            {WEEKDAYS.map((w, i) => (
              <Text
                key={w}
                className={cn(
                  'flex-1 text-center text-11 font-semibold',
                  i === 0 ? 'text-event-critical' : i === 6 ? 'text-monitor-accent-blue' : 'text-monitor-text-dim',
                )}
              >
                {w}
              </Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View className="flex-row flex-wrap">
            {cells.map((dateStr, cellIdx) => {
              if (!dateStr) {
                return <View key={`e-${cellIdx}`} style={{ width: '14.28%', height: 36 }} />;
              }
              const isSelected = dateStr === selected;
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const weekday = cellIdx % 7;
              const isSun = weekday === 0;
              const isSat = weekday === 6;
              const day = Number(dateStr.slice(8));

              return (
                <Pressable
                  key={dateStr}
                  onPress={() => { if (!isFuture) { onSelect(dateStr); onClose(); } }}
                  disabled={isFuture}
                  className="items-center justify-center"
                  style={{ width: '14.28%', height: 36 }}
                >
                  <View className={cn(
                    'w-[30px] h-[30px] rounded-control items-center justify-center',
                    isSelected ? 'bg-monitor-accent-blue' : isToday ? 'bg-monitor-accent-blue/15' : 'bg-transparent',
                  )}>
                    <Text className={cn(
                      'text-xs font-medium',
                      isSelected ? 'text-white' :
                      isToday ? 'text-monitor-accent-blue' :
                      isFuture ? 'text-monitor-border-strong' :
                      isSun ? 'text-event-critical/80' :
                      isSat ? 'text-monitor-accent-blue/80' :
                      'text-monitor-text',
                    )}>
                      {day}
                    </Text>
                    {isToday && !isSelected && (
                      <View className="absolute bottom-[3px] w-[3px] h-[3px] rounded-full bg-monitor-accent-blue" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {selected !== today && (
            <Pressable
              onPress={() => { onSelect(today); onClose(); }}
              className="mt-3 rounded-control py-2 items-center border border-monitor-accent-blue/30"
            >
              <Text className="text-xs font-medium text-monitor-accent-blue">오늘로 이동</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
