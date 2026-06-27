import React, { useCallback, useState } from 'react';
import { set, useFormValue, type StringInputProps, type TextInputProps } from 'sanity';
import { Box, Button, Stack, Text } from '@sanity/ui';
import { TranslateIcon } from '@sanity/icons';

/**
 * Custom input για τα αγγλικά πεδία (…En). Προσθέτει κουμπί «Μετάφραση» που
 * διαβάζει το αντίστοιχο ελληνικό πεδίο (…El) και το μεταφράζει αυτόματα μέσω
 * MyMemory (δωρεάν, χωρίς κλειδί). Ο χρήστης μπορεί μετά να διορθώσει ελεύθερα.
 */
export function TranslateInput(props: StringInputProps | TextInputProps) {
  const { onChange, path, renderDefault } = props;

  // Το όνομα του πεδίου (π.χ. "nameEn") → το ελληνικό αδερφάκι ("nameEl")
  const ownField = String(path[path.length - 1]);
  const srcField = ownField.replace(/En$/, 'El');
  const srcPath = [...path.slice(0, -1), srcField];
  const srcValue = useFormValue(srcPath) as string | undefined;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const translate = useCallback(async () => {
    const q = (srcValue ?? '').trim();
    if (!q) return;
    setLoading(true);
    setErr(null);
    try {
      const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}` +
        `&langpair=el|en&de=info@softbiz.eu`;
      const res = await fetch(url);
      const json = await res.json();
      const text: string | undefined = json?.responseData?.translatedText;
      if (text && Number(json?.responseStatus) === 200) {
        onChange(set(text));
      } else {
        setErr('Δεν ήταν δυνατή η μετάφραση — δοκίμασε ξανά.');
      }
    } catch {
      setErr('Σφάλμα σύνδεσης — δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  }, [srcValue, onChange]);

  return (
    <Stack space={2}>
      {renderDefault(props)}
      <Box>
        <Button
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={2}
          icon={TranslateIcon}
          text={loading ? 'Μετάφραση…' : 'Μετάφραση από Ελληνικά'}
          onClick={translate}
          disabled={!srcValue || loading}
        />
      </Box>
      {err && (
        <Text size={1} style={{ color: '#eb5757' }}>
          {err}
        </Text>
      )}
    </Stack>
  );
}
