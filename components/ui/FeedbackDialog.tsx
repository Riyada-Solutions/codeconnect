import React from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useApp } from '@/contexts/AppContext'

type DialogVariant = 'success' | 'error' | 'confirm'

interface FeedbackDialogProps {
  visible: boolean
  variant: DialogVariant
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
}

const VARIANT_ICONS: Record<DialogVariant, { name: keyof typeof Feather.glyphMap; color: string }> = {
  success: { name: 'check-circle', color: '#10b981' },
  error: { name: 'alert-circle', color: '#ef4444' },
  confirm: { name: 'help-circle', color: '#f59e0b' },
}

export default function FeedbackDialog({
  visible,
  variant,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: FeedbackDialogProps) {
  const { colors } = useApp()
  const icon = VARIANT_ICONS[variant]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.card }]}>
          <Feather name={icon.name} size={40} color={icon.color} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          <View style={styles.actions}>
            {onCancel && (
              <Pressable
                style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
                onPress={onCancel}
              >
                <Text style={[styles.btnText, { color: colors.textSecondary }]}>{cancelLabel}</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.btn, styles.confirmBtn, { backgroundColor: colors.primary }]}
              onPress={onConfirm}
            >
              <Text style={[styles.btnText, { color: colors.heroText }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  confirmBtn: {},
  btnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
})
