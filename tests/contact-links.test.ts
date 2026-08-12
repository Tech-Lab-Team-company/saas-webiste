import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createTelUrl,
  createWhatsAppUrl,
  normalizeInternationalPhone,
} from '../utils/contactLinks.ts'

test('contact links normalize formatted and local Egyptian numbers', () => {
  assert.equal(
    normalizeInternationalPhone('+20 10 08474507', '+20'),
    '+201008474507',
  )
  assert.equal(createTelUrl('+20 10 08474507', '+20'), 'tel:+201008474507')
  assert.equal(
    createWhatsAppUrl('01507659697', '+20'),
    'https://wa.me/201507659697',
  )
})

test('contact links reject empty values without creating broken URLs', () => {
  assert.equal(createTelUrl('', '+20'), null)
  assert.equal(createWhatsAppUrl(undefined, '+20'), null)
})
