import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";
import { Platform, ScrollView, ScrollViewProps } from "react-native";

type Props = KeyboardAwareScrollViewProps & ScrollViewProps;

/** iOS: keyboard-controller scroll. Android/web: plain `ScrollView` (avoids missing native `ClippingScrollViewDecoratorView`). */
export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = "handled",
  bottomOffset: _bottomOffset,
  extraKeyboardSpace: _extraKeyboardSpace,
  disableScrollOnKeyboardHide: _disableScrollOnKeyboardHide,
  enabled: _enabled,
  ScrollViewComponent: _ScrollViewComponent,
  ...props
}: Props) {
  if (Platform.OS === "web" || Platform.OS === "android") {
    return (
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode="on-drag"
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
