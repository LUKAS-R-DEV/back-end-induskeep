#!/usr/bin/env node

/**
 * Script para gerar VAPID keys para Web Push Notifications
 * 
 * Uso:
 *   node generate-vapid-keys.js
 * 
 * Ou:
 *   npx web-push generate-vapid-keys
 */

import webpush from 'web-push';

console.log('\n🔑 Gerando VAPID keys para Web Push Notifications...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('=======================================\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n=======================================\n');

console.log('📝 Adicione estas keys ao seu arquivo .env:\n');
console.log(`VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"`);
console.log(`VAPID_SUBJECT="mailto:admin@induskeep.com"`);
console.log('\n');


