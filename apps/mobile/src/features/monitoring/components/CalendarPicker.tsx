import React, { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTodayStr } from '@xross/core';

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

function pad(n: number) {
  return String(n).padStart(2, '0');
}

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
    if (month === 0) { setYear((y: number) => y - 1); setMonth(11); }
    else setMonth((m: number) => m - 1);
  }

  function nextMonth() {
    if (isNextDisabled) return;
    if (month === 11) { setYear((y: number) => y + 1); setMonth(0); }
    else setMonth((m: number) => m + 1);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
          style={{
            width: 280,
            backgroundColor: '#020618',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#1d293d',
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          {/* 월 내비게이션 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Pressable
              onPress={prevMonth}
              style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
            >
              <Ionicons name="chevron-back" size={14} color="#90a1b9" />
            </Pressable>

            <Text style={{ fontSize: 13, fontWeight: '600', color: '#e2e8f0' }}>
              {year}년 {month + 1}월
            </Text>

            <Pressable
              onPress={nextMonth}
              disabled={isNextDisabled}
              style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 6, opacity: isNextDisabled ? 0.3 : 1 }}
            >
              <Ionicons name="chevron-forward" size={14} color="#90a1b9" />
            </Pressable>
          </View>

          {/* 요일 헤더 */}
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            {WEEKDAYS.map((w, i) => (
              <Text
                key={w}
                style={{
                  flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600',
                  color: i === 0 ? '#ff6467' : i === 6 ? '#51a2ff' : '#62748e',
                }}
              >
                {w}
              </Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cells.map((dateStr, idx) => {
              if (!dateStr) {
                return <View key={`empty-${idx}`} style={{ width: '14.28%', height: 36 }} />;
              }

              const isSelected = dateStr === selected;
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const weekday = idx % 7;
              const isSun = weekday === 0;
              const isSat = weekday === 6;
              const day = Number(dateStr.slice(8));

              let textColor = '#e2e8f0';
              if (isFuture) textColor = '#314158';
              else if (isSun) textColor = 'rgba(255,100,103,0.8)';
              else if (isSat) textColor = 'rgba(81,162,255,0.8)';

              return (
                <Pressable
                  key={dateStr}
                  onPress={() => {
                    if (isFuture) return;
                    onSelect(dateStr);
                    onClose();
                  }}
                  disabled={isFuture}
                  style={{
                    width: '14.28%', height: 36,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <View style={{
                    width: 30, height: 30, borderRadius: 8,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isSelected
                      ? '#51a2ff'
                      : isToday
                        ? 'rgba(81,162,255,0.15)'
                        : 'transparent',
                  }}>
                    <Text style={{
                      fontSize: 12, fontWeight: '500',
                      color: isSelected ? '#fff' : isToday ? '#51a2ff' : textColor,
                    }}>
                      {day}
                    </Text>
                    {/* 오늘 점 표시 */}
                    {isToday && !isSelected && (
                      <View style={{
                        position: 'absolute', bottom: 3,
                        width: 3, height: 3, borderRadius: 1.5,
                        backgroundColor: '#51a2ff',
                      }} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* 오늘로 이동 */}
          {selected !== today && (
            <Pressable
              onPress={() => { onSelect(today); onClose(); }}
              style={{
                marginTop: 12, borderRadius: 8,
                borderWidth: 1, borderColor: 'rgba(81,162,255,0.3)',
                paddingVertical: 8, alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#51a2ff' }}>
                오늘로 이동
              </Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
