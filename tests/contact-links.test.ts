import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createTelegramUrl,
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

test('telegram links accept usernames and official telegram URLs', () => {
  assert.equal(createTelegramUrl('@teacher_support'), 'https://t.me/teacher_support')
  assert.equal(
    createTelegramUrl('telegram.me/teacher_support'),
    'https://t.me/teacher_support',
  )
  assert.equal(
    createTelegramUrl('https://t.me/+AbCdEf123'),
    'https://t.me/+AbCdEf123',
  )
  assert.equal(
    createTelegramUrl('tg://resolve?domain=teacher_support'),
    'https://t.me/teacher_support',
  )
  assert.equal(createTelegramUrl('+20 100 123 4567'), 'https://t.me/+201001234567')
})

test('telegram links reject unsafe and incomplete values', () => {
  assert.equal(createTelegramUrl('javascript:alert(1)'), null)
  assert.equal(createTelegramUrl('user'), null)
  assert.equal(createTelegramUrl(undefined), null)
})
