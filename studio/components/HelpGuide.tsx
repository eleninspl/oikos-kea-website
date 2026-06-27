import React from 'react'
import { Card, Container, Stack, Heading, Text, Box } from '@sanity/ui'

type Step = { title: string; body: string }

const STEPS: Step[] = [
  {
    title: 'Αλλαγή τιμής ή ονόματος',
    body: '«Το Μενού μου» → διάλεξε καρτέλα → διάλεξε κατηγορία → άνοιξε το προϊόν, άλλαξε το πεδίο → «Publish» πάνω δεξιά.',
  },
  {
    title: 'Κρύψιμο προϊόντος (χωρίς διαγραφή)',
    body: 'Στο προϊόν ενεργοποίησε τον διακόπτη «Απόκρυψη». Εξαφανίζεται από το site αλλά μένει αποθηκευμένο. Ξαναβάλ’ το όποτε θες.',
  },
  {
    title: 'Προσωρινά εξαντλημένο',
    body: 'Ξεμάρκαρε τον διακόπτη «Διαθέσιμο» στο προϊόν — μένει στη λίστα αλλά εμφανίζεται γκριζαρισμένο ως «εξαντλήθηκε». Ξαναβάλ’ το όταν επιστρέψει.',
  },
  {
    title: 'Νέο προϊόν',
    body: '«Το Μενού μου» → καρτέλα → κατηγορία → πάτα «Create» στη λίστα «Προϊόντα», συμπλήρωσε όνομα (ΕΛ & EN) και τιμή. Βεβαιώσου ότι το πεδίο «Κατηγορία» δείχνει τη σωστή κατηγορία.',
  },
  {
    title: 'Νέα κατηγορία',
    body: 'Στο «Κατηγορίες» πάτα «+». Δώσε όνομα (ΕΛ & EN) και στο πεδίο «Καρτέλα» διάλεξε σε ποια καρτέλα ανήκει.',
  },
  {
    title: 'Νέα ή αλλαγή καρτέλας (menu)',
    body: 'Στο «Καρτέλες» μπορείς να προσθέσεις νέα καρτέλα (π.χ. «Κρασιά»), να μετονομάσεις ή να αλλάξεις σειρά. Ο κωδικός μπαίνει αυτόματα.',
  },
  {
    title: 'Αλλαγή σειράς',
    body: 'Όλα μπαίνουν σε σειρά με σύρσιμο (drag & drop): τα προϊόντα μέσα στην κατηγορία, και οι κατηγορίες/καρτέλες από τις λίστες «Κατηγορίες» / «Καρτέλες».',
  },
  {
    title: 'Δημοσίευση',
    body: 'Κάθε αλλαγή χρειάζεται «Publish». Το site ενημερώνεται μόνο του μέσα σε ~1 λεπτό.',
  },
]

export function HelpGuide() {
  return (
    <Container width={1} style={{ padding: '24px' }}>
      <Stack space={4}>
        <Stack space={2}>
          <Heading size={3} style={{ color: '#c9a96e' }}>
            Οδηγίες Χρήσης
          </Heading>
          <Text size={1} muted>
            Σύντομος οδηγός για τη διαχείριση του μενού. Δεν χρειάζεσαι τεχνικές γνώσεις.
          </Text>
        </Stack>

        <Stack space={3}>
          {STEPS.map((s) => (
            <Card key={s.title} padding={4} radius={3} shadow={1} tone="default">
              <Stack space={3}>
                <Text weight="semibold" size={2}>
                  {s.title}
                </Text>
                <Text size={1} muted style={{ lineHeight: 1.6 }}>
                  {s.body}
                </Text>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Card padding={4} radius={3} tone="primary">
          <Text size={1}>
            <strong>Συμβουλή:</strong> Αν κάτι πάει στραβά, οι αλλαγές δεν χάνονται —
            μπορείς πάντα να επιστρέψεις σε προηγούμενη έκδοση από το ιστορικό (το ρολόι
            πάνω δεξιά σε κάθε προϊόν).
          </Text>
        </Card>

        <Box paddingTop={2}>
          <Text size={1} muted align="center">
            OIKOS · Korrisia, Kéa — Διαχείριση Μενού
          </Text>
        </Box>
      </Stack>
    </Container>
  )
}

export default HelpGuide
