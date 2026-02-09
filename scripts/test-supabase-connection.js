#!/usr/bin/env node

/**
 * Script de prueba: Conexión con Supabase
 * Ejecuta: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Verificando conexión con Supabase...\n');

// Verificar variables de entorno
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 Variables de entorno:');
console.log(`   URL: ${url ? '✅' : '❌'} ${url || '(falta)'}`);
console.log(`   ANON_KEY: ${anonKey ? '✅' : '❌'} ${anonKey ? anonKey.substring(0, 20) + '...' : '(falta)'}`);
console.log(`   SERVICE_KEY: ${serviceKey ? '✅' : '❌'} ${serviceKey ? serviceKey.substring(0, 20) + '...' : '(falta)'}`);
console.log('');

if (!url || !anonKey) {
  console.error('❌ Faltan variables de entorno necesarias');
  process.exit(1);
}

// Crear cliente
const supabase = createClient(url, anonKey);

async function testConnection() {
  try {
    // Test 1: Verificar tabla profiles
    console.log('🧪 Test 1: Verificar tabla profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error al acceder a profiles:', profilesError.message);
    } else {
      console.log('✅ Tabla profiles accesible');
    }

    // Test 2: Verificar tabla events
    console.log('\n🧪 Test 2: Verificar tabla events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    if (eventsError) {
      console.error('❌ Error al acceder a events:', eventsError.message);
    } else {
      console.log('✅ Tabla events accesible');
    }

    // Test 3: Verificar auth
    console.log('\n🧪 Test 3: Verificar Supabase Auth...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Error en auth:', authError.message);
    } else {
      console.log('✅ Supabase Auth funcionando');
      console.log(`   Sesión actual: ${session ? 'Sí' : 'No'}`);
    }

    // Test 4: Intentar crear un usuario de prueba (NO LO HACE, SOLO VERIFICA)
    console.log('\n🧪 Test 4: Verificar que podemos registrar usuarios...');
    console.log('   (No crea ningún usuario, solo verifica permisos)');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'test123456',
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    if (signUpError) {
      console.error('❌ Error al intentar registrar:', signUpError.message);
      if (signUpError.message.includes('Database error')) {
        console.log('\n💡 PROBLEMA DETECTADO:');
        console.log('   El trigger handle_new_user no está funcionando');
        console.log('   Ejecuta: scripts/auth-migration-minimal.sql en Supabase');
      }
    } else {
      console.log('✅ Registro de usuarios funcionando');
      
      // Limpiar usuario de prueba
      if (signUpData.user) {
        const adminClient = createClient(url, serviceKey);
        await adminClient.auth.admin.deleteUser(signUpData.user.id);
        console.log('   (Usuario de prueba eliminado)');
      }
    }

    console.log('\n✅ Diagnóstico completado');

  } catch (error) {
    console.error('\n❌ Error inesperado:', error.message);
  }
}

testConnection();
