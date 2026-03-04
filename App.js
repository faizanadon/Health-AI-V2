/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       HealthAI — AI Healthcare Management System            ║
 * ║       React Native (Expo) — Full Mobile App                 ║
 * ║       FYP Project · Lahore Garrison University · BSCS       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

/**
 * HealthAI — Redesigned
 * Light theme · Ionicons · Modern UI
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  FlatList, Alert, Linking, KeyboardAvoidingView, Platform,
  Dimensions, StatusBar, Modal, ActivityIndicator, SafeAreaView as RNSafeArea,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  bg:            '#F1F5F9',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F8FAFC',
  border:        '#E2E8F0',
  borderLight:   '#F1F5F9',

  primary:       '#2563EB',
  primaryLight:  '#EFF6FF',
  primaryMid:    '#BFDBFE',

  green:         '#059669',
  greenLight:    '#ECFDF5',
  greenMid:      '#A7F3D0',

  red:           '#DC2626',
  redLight:      '#FEF2F2',
  redMid:        '#FECACA',

  amber:         '#D97706',
  amberLight:    '#FFFBEB',
  amberMid:      '#FDE68A',

  purple:        '#7C3AED',
  purpleLight:   '#F5F3FF',

  text:          '#0F172A',
  textSec:       '#475569',
  textMuted:     '#94A3B8',
  textDisabled:  '#CBD5E1',

  white:         '#FFFFFF',
  shadow:        '#64748B',
};

const FONT = {
  xs:   10, sm: 12, base: 14, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 30,
};

// ─── SHADOW HELPER ───────────────────────────────────────────────
const shadow = (level = 1) => ({
  shadowColor: C.shadow,
  shadowOffset: { width: 0, height: level },
  shadowOpacity: level * 0.06,
  shadowRadius: level * 3,
  elevation: level * 2,
});

// ─── DATA ────────────────────────────────────────────────────────
const DOCTORS = [
  { id:1, name:'Dr. Sarah Ahmed',  spec:'Cardiologist',     rating:4.8, exp:'12 yrs', fee:'Rs. 2,500', avail:true,  slots:['9:00 AM','10:30 AM','2:00 PM','4:00 PM'],   address:'Gulberg III, Lahore',  icon:'heart' },
  { id:2, name:'Dr. Usman Khan',   spec:'Neurologist',      rating:4.6, exp:'9 yrs',  fee:'Rs. 3,000', avail:true,  slots:['11:00 AM','1:00 PM','3:30 PM'],              address:'DHA Phase 5, Lahore',  icon:'brain' },
  { id:3, name:'Dr. Fatima Malik', spec:'Dermatologist',    rating:4.9, exp:'7 yrs',  fee:'Rs. 1,800', avail:true,  slots:['9:30 AM','11:30 AM','2:30 PM','5:00 PM'],    address:'Model Town, Lahore',   icon:'leaf' },
  { id:4, name:'Dr. Ali Raza',     spec:'Orthopedist',      rating:4.7, exp:'15 yrs', fee:'Rs. 2,200', avail:false, slots:['10:00 AM','12:00 PM','3:00 PM'],              address:'Garden Town, Lahore',  icon:'bone' },
  { id:5, name:'Dr. Nadia Shah',   spec:'Pediatrician',     rating:4.9, exp:'11 yrs', fee:'Rs. 1,500', avail:true,  slots:['9:00 AM','10:00 AM','1:30 PM','4:30 PM'],    address:'Bahria Town, Lahore',  icon:'baby' },
  { id:6, name:'Dr. Hassan Baig',  spec:'Gen. Physician',   rating:4.5, exp:'6 yrs',  fee:'Rs. 1,000', avail:true,  slots:['8:30 AM','10:30 AM','12:30 PM','3:00 PM'],   address:'Johar Town, Lahore',   icon:'stethoscope' },
];

const MEDICINES = [
  { id:1, name:'Paracetamol 500mg',  type:'Analgesic',     price:'Rs. 120', stock:85, unit:'Strip of 10', uses:'Fever, mild pain' },
  { id:2, name:'Amoxicillin 250mg',  type:'Antibiotic',    price:'Rs. 280', stock:60, unit:'Pack of 15',  uses:'Bacterial infections' },
  { id:3, name:'Omeprazole 20mg',    type:'PPI',           price:'Rs. 180', stock:70, unit:'Strip of 14', uses:'Acidity, GERD' },
  { id:4, name:'Cetirizine 10mg',    type:'Antihistamine', price:'Rs. 95',  stock:90, unit:'Strip of 10', uses:'Allergies, cold' },
  { id:5, name:'Metformin 500mg',    type:'Antidiabetic',  price:'Rs. 220', stock:45, unit:'Pack of 30',  uses:'Diabetes type 2' },
  { id:6, name:'Ibuprofen 400mg',    type:'NSAID',         price:'Rs. 140', stock:78, unit:'Strip of 10', uses:'Pain, inflammation' },
  { id:7, name:'Azithromycin 500mg', type:'Antibiotic',    price:'Rs. 420', stock:30, unit:'Pack of 3',   uses:'Respiratory infections' },
  { id:8, name:'Atorvastatin 20mg',  type:'Statin',        price:'Rs. 350', stock:55, unit:'Pack of 30',  uses:'Cholesterol' },
];

const BLOOD_TYPES = [
  {type:'A+',units:12,donors:8},{type:'A-',units:4,donors:3},
  {type:'B+',units:18,donors:11},{type:'B-',units:3,donors:2},
  {type:'AB+',units:7,donors:5},{type:'AB-',units:2,donors:1},
  {type:'O+',units:22,donors:15},{type:'O-',units:6,donors:4},
];

const DONORS = [
  {name:'Ahmad Raza',   blood:'O+', city:'Lahore', last:'2 months ago', phone:'0300-1234567'},
  {name:'Sana Mirza',   blood:'A+', city:'Lahore', last:'1 month ago',  phone:'0311-9876543'},
  {name:'Bilal Hassan', blood:'B+', city:'Lahore', last:'3 months ago', phone:'0321-5556677'},
  {name:'Zara Hussain', blood:'O-', city:'Lahore', last:'6 weeks ago',  phone:'0333-4441122'},
  {name:'Imran Sheikh', blood:'AB+',city:'Lahore', last:'5 months ago', phone:'0345-7788990'},
];

const NEARBY = [
  {id:1,type:'doctor',  name:'Dr. Sarah Ahmed Clinic', spec:'Cardiologist',    addr:'Gulberg III',  dist:'1.2 km',rating:4.8,lat:31.5204,lng:74.3587},
  {id:2,type:'doctor',  name:'Dr. Usman Khan',          spec:'Neurologist',     addr:'DHA Phase 5',  dist:'2.8 km',rating:4.6,lat:31.4730,lng:74.4012},
  {id:3,type:'doctor',  name:'Dr. Fatima Malik',        spec:'Dermatologist',   addr:'Model Town',   dist:'3.1 km',rating:4.9,lat:31.4826,lng:74.3209},
  {id:4,type:'pharmacy',name:'MedPlus Pharmacy',        spec:'24/7 Open',       addr:'Gulberg II',   dist:'0.8 km',rating:4.7,lat:31.5156,lng:74.3524},
  {id:5,type:'pharmacy',name:'City Pharmacy',           spec:'Open till 11 PM', addr:'Liberty Mkt',  dist:'1.5 km',rating:4.4,lat:31.5189,lng:74.3440},
  {id:6,type:'pharmacy',name:'HealthPlus Chemist',      spec:'Open 24/7',       addr:'DHA Phase 1',  dist:'3.4 km',rating:4.6,lat:31.4890,lng:74.3924},
  {id:7,type:'hospital',name:'Lahore General Hospital', spec:'Emergency 24/7',  addr:'Jail Road',    dist:'2.1 km',rating:4.2,lat:31.5497,lng:74.3436},
  {id:8,type:'hospital',name:'Services Hospital',       spec:'Emergency 24/7',  addr:'Shadman',      dist:'2.9 km',rating:4.0,lat:31.5345,lng:74.3298},
  {id:9,type:'hospital',name:'Shaukat Khanum Hospital', spec:'Specialist',      addr:'Johar Town',   dist:'4.8 km',rating:4.9,lat:31.4702,lng:74.2700},
];

const SYMPTOMS = ['Fever','Headache','Chest pain','Skin rash','Back pain','Cough','Stomach ache','Dizziness'];

// ─── AI ──────────────────────────────────────────────────────────
const AI_SYSTEM = `You are HealthBot, AI medical assistant for HealthAI Pakistan. Analyze symptoms, recommend specialists (General Physician, Cardiologist, Neurologist, Dermatologist, Orthopedist, Pediatrician), suggest OTC medicines (Paracetamol, Ibuprofen, Cetirizine, Omeprazole). Use **bold** for medicines and specialists. Max 150 words. Emergencies: call 115. Never diagnose, only guide.`;

async function callAI(history) {
  const API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type':'application/json','anthropic-version':'2023-06-01','x-api-key':API_KEY },
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:AI_SYSTEM, messages:history }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message||'API error'); }
  return (await res.json()).content[0].text;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────
const Avatar = ({ name, size = 44, color = C.primary, light }) => {
  const bg = light ? color + '18' : color;
  const tc = light ? color : C.white;
  return (
    <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:bg, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ color:tc, fontWeight:'700', fontSize:size*0.38 }}>{name?.[0]?.toUpperCase()}</Text>
    </View>
  );
};

const Pill = ({ label, color, bg }) => (
  <View style={{ paddingHorizontal:8, paddingVertical:3, borderRadius:20, backgroundColor: bg || color+'15' }}>
    <Text style={{ fontSize:FONT.xs, fontWeight:'600', color: color, letterSpacing:0.3 }}>{label}</Text>
  </View>
);

const Divider = ({ style }) => <View style={[{ height:1, backgroundColor:C.border }, style]} />;

const SearchBar = ({ value, onChangeText, placeholder }) => (
  <View style={s.searchBar}>
    <Ionicons name="search-outline" size={18} color={C.textMuted} />
    <TextInput
      style={s.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || 'Search…'}
      placeholderTextColor={C.textMuted}
    />
    {value?.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <Ionicons name="close-circle" size={16} color={C.textMuted} />
      </TouchableOpacity>
    )}
  </View>
);

const FilterChip = ({ label, active, onPress, color }) => {
  const ac = color || C.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.filterChip, active && { backgroundColor: ac+'15', borderColor: ac }]}>
      <Text style={[s.filterChipTxt, active && { color: ac, fontWeight:'600' }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const PrimaryButton = ({ label, onPress, disabled, icon, color, style }) => {
  const bg = disabled ? C.border : (color || C.primary);
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85} style={style}>
      <View style={[s.primaryBtn, { backgroundColor: bg }]}>
        {icon && <Ionicons name={icon} size={16} color={C.white} style={{ marginRight:6 }} />}
        <Text style={s.primaryBtnTxt}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const OutlineButton = ({ label, onPress, icon, color, style }) => {
  const ac = color || C.primary;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
      <View style={[s.outlineBtn, { borderColor: ac }]}>
        {icon && <Ionicons name={icon} size={15} color={ac} style={{ marginRight:5 }} />}
        <Text style={[s.outlineBtnTxt, { color: ac }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Card = ({ children, style, onPress, noPad }) => {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} activeOpacity={0.92}
      style={[s.card, noPad && { padding:0 }, style]}>
      {children}
    </Wrap>
  );
};

const SectionLabel = ({ title, action, onAction }) => (
  <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
    <Text style={s.sectionTitle}>{title}</Text>
    {action && <TouchableOpacity onPress={onAction}><Text style={{ color:C.primary, fontSize:FONT.sm, fontWeight:'600' }}>{action}</Text></TouchableOpacity>}
  </View>
);

const BoldText = ({ text, style }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <Text style={[{ color:C.text, fontSize:FONT.base, lineHeight:22 }, style]}>
      {parts.map((p,i) => i%2===1
        ? <Text key={i} style={{ fontWeight:'700', color:C.primary }}>{p}</Text>
        : p)}
    </Text>
  );
};

const getTime = () => new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

const ScreenHeader = ({ title, subtitle, right, back }) => (
  <View style={s.header}>
    <View style={{ flex:1 }}>
      {subtitle && <Text style={s.headerSub}>{subtitle}</Text>}
      <Text style={s.headerTitle}>{title}</Text>
    </View>
    {right}
  </View>
);

// ─── HOME ────────────────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const stats = [
    { label:'Doctors',      val:'6',    sub:'Available now',  color:C.primary,  bg:C.primaryLight,  icon:'medical-outline',          lib:'ion' },
    { label:'Medicines',    val:'8',    sub:'In stock',       color:C.green,    bg:C.greenLight,    icon:'medkit-outline',           lib:'ion' },
    { label:'Blood Units',  val:'74',   sub:'8 types ready',  color:C.red,      bg:C.redLight,      icon:'water-outline',            lib:'ion' },
    { label:'AI Consults',  val:'1.2K', sub:'+18% this week', color:C.purple,   bg:C.purpleLight,   icon:'chatbubble-ellipses-outline', lib:'ion' },
  ];
  const actions = [
    { label:'AI Symptom Check', icon:'chatbubble-ellipses-outline', tab:'Chat',     color:C.primary, bg:C.primaryLight },
    { label:'Book a Doctor',    icon:'calendar-outline',            tab:'Doctors',  color:C.green,   bg:C.greenLight   },
    { label:'Find Medicine',    icon:'medkit-outline',              tab:'Pharmacy', color:C.amber,   bg:C.amberLight   },
    { label:'Blood Bank',       icon:'water-outline',               tab:'Blood',    color:C.red,     bg:C.redLight     },
  ];
  const activity = [
    { text:'Dr. Sarah Ahmed added 2 new slots', time:'5m ago',  color:C.primary },
    { text:'O+ blood request fulfilled',         time:'22m ago', color:C.red     },
    { text:'New stock: Azithromycin 500mg',       time:'1h ago',  color:C.green   },
    { text:'AI helped 12 patients today',         time:'2h ago',  color:C.amber   },
  ];

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* Top bar */}
      <View style={[s.header, { paddingBottom:16 }]}>
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:FONT.sm, color:C.textMuted, marginBottom:2 }}>Good morning</Text>
          <Text style={{ fontSize:FONT.xl, fontWeight:'800', color:C.text, letterSpacing:-0.5 }}>HealthAI</Text>
        </View>
        <View style={[s.iconCircle, { backgroundColor:C.primaryLight }]}>
          <Ionicons name="person-outline" size={20} color={C.primary} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:24 }}>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:16, gap:10, paddingBottom:4 }}>
          {stats.map((st,i) => (
            <View key={i} style={[s.statCard, { backgroundColor:st.bg }]}>
              <View style={[s.iconCircle, { backgroundColor:st.color+'22', marginBottom:10 }]}>
                <Ionicons name={st.icon} size={20} color={st.color} />
              </View>
              <Text style={{ fontSize:FONT.xxl, fontWeight:'800', color:st.color }}>{st.val}</Text>
              <Text style={{ fontSize:FONT.base, fontWeight:'600', color:C.text, marginTop:2 }}>{st.label}</Text>
              <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:2 }}>{st.sub}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal:16, marginTop:20, gap:12 }}>

          {/* Quick Actions */}
          <SectionLabel title="Quick Actions" />
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10 }}>
            {actions.map((a,i) => (
              <TouchableOpacity key={i} style={{ width:(SW-42)/2 }} onPress={() => navigation.navigate(a.tab)} activeOpacity={0.88}>
                <View style={[s.actionCard, { backgroundColor:a.bg }]}>
                  <View style={[s.iconCircle, { backgroundColor:a.color+'22', marginBottom:10 }]}>
                    <Ionicons name={a.icon} size={22} color={a.color} />
                  </View>
                  <Text style={{ fontSize:FONT.md, fontWeight:'700', color:a.color }}>{a.label}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', marginTop:6 }}>
                    <Text style={{ fontSize:FONT.xs, color:a.color+'99' }}>Tap to open</Text>
                    <Ionicons name="arrow-forward" size={12} color={a.color+'99'} style={{ marginLeft:4 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Activity */}
          <Card style={{ marginTop:8 }} noPad>
            <View style={{ padding:16, paddingBottom:8 }}>
              <SectionLabel title="Recent Activity" />
            </View>
            {activity.map((a,i) => (
              <View key={i}>
                <View style={{ flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingVertical:12 }}>
                  <View style={{ width:36, height:36, borderRadius:18, backgroundColor:a.color+'15', alignItems:'center', justifyContent:'center' }}>
                    <Ionicons name="radio-button-on" size={12} color={a.color} />
                  </View>
                  <Text style={{ flex:1, fontSize:FONT.sm, color:C.textSec, lineHeight:18 }} numberOfLines={1}>{a.text}</Text>
                  <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{a.time}</Text>
                </View>
                {i < activity.length-1 && <Divider style={{ marginLeft:64 }} />}
              </View>
            ))}
          </Card>

          {/* Emergency Banner */}
          <TouchableOpacity onPress={() => Linking.openURL('tel:115')} activeOpacity={0.88}>
            <View style={[s.emergencyBanner]}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
                <View style={[s.iconCircle, { backgroundColor:C.red+'22' }]}>
                  <Ionicons name="warning-outline" size={20} color={C.red} />
                </View>
                <View>
                  <Text style={{ fontSize:FONT.md, fontWeight:'700', color:C.red }}>Emergency?</Text>
                  <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:1 }}>Tap to call 115 Rescue</Text>
                </View>
              </View>
              <Ionicons name="call-outline" size={20} color={C.red} />
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────
function ChatScreen() {
  const [msgs, setMsgs] = useState([
    { role:'bot', text:"Hello! I'm your **AI Health Assistant**.\n\nI can help you:\n• Analyze your symptoms\n• Recommend the right specialist\n• Suggest over-the-counter medicines\n\nHow are you feeling today?", time:getTime() }
  ]);
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 120);
  }, [msgs]);

  const send = async (txt) => {
    const msg = (txt || input).trim();
    if (!msg || busy) return;
    setInput('');
    setMsgs(m => [...m, { role:'user', text:msg, time:getTime() }]);
    const nh = [...hist, { role:'user', content:msg }];
    setHist(nh); setBusy(true);
    try {
      const reply = await callAI(nh);
      setMsgs(m => [...m, { role:'bot', text:reply, time:getTime() }]);
      setHist(h => [...h, { role:'assistant', content:reply }]);
    } catch(e) {
      setMsgs(m => [...m, { role:'bot', text:`Connection error: ${e.message}`, time:getTime() }]);
    } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader
        title="AI Health Assistant"
        subtitle="Powered by Claude AI"
        right={
          <View style={[s.iconCircle, { backgroundColor:C.greenLight }]}>
            <View style={{ width:8, height:8, borderRadius:4, backgroundColor:C.green }} />
          </View>
        }
      />

      {/* Symptom chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ maxHeight:48, borderBottomWidth:1, borderBottomColor:C.border }}
        contentContainerStyle={{ paddingHorizontal:14, gap:8, paddingVertical:8, alignItems:'center' }}>
        {SYMPTOMS.map(sym => (
          <TouchableOpacity key={sym} onPress={() => send(sym)} disabled={busy}
            style={[s.filterChip, { backgroundColor:C.primaryLight, borderColor:C.primaryMid }]}>
            <Text style={{ color:C.primary, fontSize:FONT.xs, fontWeight:'500' }}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView ref={scrollRef} style={{ flex:1 }} contentContainerStyle={{ padding:14, gap:12 }}>
        {msgs.map((m,i) => (
          <View key={i} style={{ flexDirection:'row', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:8 }}>
            {m.role==='bot' && (
              <View style={[s.iconCircle, { backgroundColor:C.primaryLight, marginBottom:18 }]}>
                <Ionicons name="medkit-outline" size={16} color={C.primary} />
              </View>
            )}
            <View style={{ maxWidth:'76%' }}>
              {m.role==='user'
                ? <View style={s.userBubble}>
                    <Text style={{ color:C.white, fontSize:FONT.base, lineHeight:21 }}>{m.text}</Text>
                  </View>
                : <View style={s.botBubble}>
                    <BoldText text={m.text} />
                  </View>
              }
              <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:4, paddingHorizontal:4,
                textAlign:m.role==='user'?'right':'left' }}>{m.time}</Text>
            </View>
          </View>
        ))}

        {busy && (
          <View style={{ flexDirection:'row', alignItems:'flex-end', gap:8 }}>
            <View style={[s.iconCircle, { backgroundColor:C.primaryLight, marginBottom:18 }]}>
              <Ionicons name="medkit-outline" size={16} color={C.primary} />
            </View>
            <View style={[s.botBubble, { paddingVertical:14, paddingHorizontal:20 }]}>
              <ActivityIndicator size="small" color={C.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={80}>
        <View style={s.inputRow}>
          <TextInput
            style={[s.chatInput, { flex:1 }]}
            placeholder="Describe your symptoms…"
            placeholderTextColor={C.textMuted}
            value={input} onChangeText={setInput}
            onSubmitEditing={() => send()} editable={!busy}
            returnKeyType="send" multiline
          />
          <TouchableOpacity onPress={() => send()} disabled={busy || !input.trim()}
            style={[s.sendBtn, { backgroundColor: (busy||!input.trim()) ? C.border : C.primary }]}>
            <Ionicons name="arrow-up" size={18} color={C.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL('tel:115')}
          style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', gap:6, paddingVertical:10, backgroundColor:C.redLight, borderTopWidth:1, borderTopColor:C.redMid }}>
          <Ionicons name="warning-outline" size={14} color={C.red} />
          <Text style={{ color:C.red, fontSize:FONT.sm, fontWeight:'600' }}>Emergency? Call 115 Rescue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── DOCTORS ─────────────────────────────────────────────────────
function DoctorsScreen() {
  const [search, setSearch] = useState('');
  const [specF, setSpecF] = useState('All');
  const [selSlots, setSelSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [bookDoc, setBookDoc] = useState(null);
  const [form, setForm] = useState({ name:'', phone:'', date:'' });
  const [ok, setOk] = useState(null);
  const specs = ['All', ...new Set(DOCTORS.map(d => d.spec))];
  const list = DOCTORS.filter(d => {
    if (specF !== 'All' && d.spec !== specF) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) &&
       !d.spec.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doBook = () => {
    if (!form.name || !form.date) { Alert.alert('Missing Info', 'Please enter name and date.'); return; }
    const sl = selSlots[bookDoc.id];
    setBookedSlots(b => ({ ...b, [bookDoc.id]: [...(b[bookDoc.id]||[]), sl] }));
    setOk({ doc:bookDoc.name, sl, date:form.date, name:form.name });
    setBookDoc(null); setForm({ name:'', phone:'', date:'' });
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Find Doctors" subtitle="Book specialist appointments" />

      <View style={{ padding:14, gap:10 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search by name or specialty…" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8 }}>
          {specs.map(sp => <FilterChip key={sp} label={sp} active={specF===sp} onPress={() => setSpecF(sp)} />)}
        </ScrollView>
      </View>

      <FlatList
        data={list} keyExtractor={d => String(d.id)}
        contentContainerStyle={{ paddingHorizontal:14, gap:12, paddingBottom:24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item:doc }) => {
          const booked = bookedSlots[doc.id] || [];
          const sel = selSlots[doc.id];
          return (
            <Card>
              {/* Doctor Info */}
              <View style={{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 }}>
                <Avatar name={doc.name} size={48} color={C.primary} />
                <View style={{ flex:1 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                    <Text style={{ fontSize:FONT.md, fontWeight:'700', color:C.text, flex:1 }} numberOfLines={1}>{doc.name}</Text>
                    <Pill label={doc.avail?'Available':'Busy'} color={doc.avail?C.green:C.red} />
                  </View>
                  <Text style={{ fontSize:FONT.sm, color:C.textMuted, marginTop:2 }}>{doc.spec}</Text>
                  <View style={{ flexDirection:'row', gap:10, marginTop:6 }}>
                    <View style={{ flexDirection:'row', alignItems:'center', gap:3 }}>
                      <Ionicons name="star" size={11} color={C.amber} />
                      <Text style={{ fontSize:FONT.xs, color:C.textSec, fontWeight:'600' }}>{doc.rating}</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center', gap:3 }}>
                      <Ionicons name="time-outline" size={11} color={C.textMuted} />
                      <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{doc.exp}</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center', gap:3 }}>
                      <Ionicons name="wallet-outline" size={11} color={C.textMuted} />
                      <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{doc.fee}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection:'row', alignItems:'center', gap:4, marginBottom:12 }}>
                <Ionicons name="location-outline" size={13} color={C.textMuted} />
                <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{doc.address}</Text>
              </View>

              <Divider style={{ marginBottom:12 }} />

              {/* Slots */}
              <Text style={{ fontSize:FONT.xs, fontWeight:'600', color:C.textSec, marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>Available Slots</Text>
              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                {doc.slots.map(sl => {
                  const isB = booked.includes(sl), isSel = sel === sl;
                  return (
                    <TouchableOpacity key={sl} disabled={isB}
                      onPress={() => setSelSlots(p => ({ ...p, [doc.id]:sl }))}
                      style={[s.slotChip,
                        isSel && { backgroundColor:C.primary, borderColor:C.primary },
                        isB && { opacity:0.35 }]}>
                      <Text style={[s.slotChipTxt, isSel && { color:C.white }]}>{sl}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {doc.avail && (
                <PrimaryButton
                  label={sel ? `Book ${sel}` : 'Select a slot to book'}
                  onPress={() => { if(sel) setBookDoc(doc); else Alert.alert('Select Slot','Please pick a time first.'); }}
                  disabled={!sel}
                  icon="calendar-outline"
                />
              )}
            </Card>
          );
        }}
      />

      {/* Booking Modal */}
      <Modal visible={!!bookDoc} transparent animationType="slide" onRequestClose={() => setBookDoc(null)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <Text style={s.sheetTitle}>Confirm Appointment</Text>
              <TouchableOpacity onPress={() => setBookDoc(null)}>
                <Ionicons name="close" size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            {bookDoc && (
              <View style={[s.infoBox, { marginBottom:16 }]}>
                <Avatar name={bookDoc.name} size={40} color={C.primary} />
                <View style={{ marginLeft:12 }}>
                  <Text style={{ fontWeight:'700', color:C.text, fontSize:FONT.base }}>{bookDoc.name}</Text>
                  <Text style={{ color:C.textMuted, fontSize:FONT.sm, marginTop:2 }}>{bookDoc.spec} · {selSlots[bookDoc?.id]}</Text>
                </View>
              </View>
            )}

            <Text style={s.fieldLabel}>PATIENT NAME</Text>
            <TextInput style={[s.formInput, { marginBottom:12 }]} placeholder="Full name" placeholderTextColor={C.textMuted}
              value={form.name} onChangeText={v => setForm(f => ({ ...f, name:v }))} />
            <Text style={s.fieldLabel}>PHONE NUMBER</Text>
            <TextInput style={[s.formInput, { marginBottom:12 }]} placeholder="03XX-XXXXXXX" placeholderTextColor={C.textMuted}
              keyboardType="phone-pad" value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone:v }))} />
            <Text style={s.fieldLabel}>DATE</Text>
            <TextInput style={[s.formInput, { marginBottom:20 }]} placeholder="YYYY-MM-DD" placeholderTextColor={C.textMuted}
              value={form.date} onChangeText={v => setForm(f => ({ ...f, date:v }))} />

            <View style={{ flexDirection:'row', gap:10 }}>
              <PrimaryButton label="Confirm Booking" onPress={doBook} icon="checkmark-outline" style={{ flex:1 }} />
              <OutlineButton label="Cancel" onPress={() => setBookDoc(null)} style={{ flex:1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={!!ok} transparent animationType="fade" onRequestClose={() => setOk(null)}>
        <View style={s.overlay}>
          <View style={[s.sheet, { alignItems:'center' }]}>
            <View style={[s.iconCircle, { width:64, height:64, borderRadius:32, backgroundColor:C.greenLight, marginBottom:14 }]}>
              <Ionicons name="checkmark-circle" size={36} color={C.green} />
            </View>
            <Text style={[s.sheetTitle, { textAlign:'center' }]}>Appointment Booked!</Text>
            {ok && <>
              <Text style={{ color:C.textMuted, textAlign:'center', marginBottom:4, fontSize:FONT.base }}>{ok.name} with {ok.doc}</Text>
              <Pill label={`${ok.date} at ${ok.sl}`} color={C.green} bg={C.greenLight} />
              <View style={{ height:20 }} />
            </>}
            <PrimaryButton label="Done" onPress={() => setOk(null)} icon="checkmark-outline" style={{ width:'100%' }} color={C.green} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── PHARMACY ────────────────────────────────────────────────────
function PharmacyScreen() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const tog = id => setCart(c => c.includes(id) ? c.filter(x=>x!==id) : [...c,id]);
  const sc = v => v>70 ? C.green : v>40 ? C.amber : C.red;
  const list = MEDICINES.filter(m => !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.uses.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Pharmacy" subtitle="Medicines & availability"
        right={
          <TouchableOpacity onPress={() => setCartOpen(true)} style={{ position:'relative' }}>
            <View style={[s.iconCircle, { backgroundColor:C.amberLight }]}>
              <Ionicons name="bag-outline" size={20} color={C.amber} />
            </View>
            {cart.length > 0 && (
              <View style={s.badge}>
                <Text style={{ color:C.white, fontSize:9, fontWeight:'800' }}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <View style={{ padding:14 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search medicines or conditions…" />
      </View>

      <FlatList
        data={list} keyExtractor={m => String(m.id)} numColumns={2}
        contentContainerStyle={{ paddingHorizontal:14, paddingBottom:24 }}
        columnWrapperStyle={{ gap:10, marginBottom:10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item:med }) => {
          const inC = cart.includes(med.id), stc = sc(med.stock);
          return (
            <Card style={{ flex:1 }}>
              <View style={[s.iconCircle, { backgroundColor:C.primaryLight, marginBottom:10 }]}>
                <Ionicons name="medkit-outline" size={18} color={C.primary} />
              </View>
              <Text style={{ fontSize:FONT.sm, fontWeight:'800', color:C.text, marginBottom:2 }} numberOfLines={2}>{med.name}</Text>
              <Pill label={med.type} color={C.primary} />
              <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:8 }}>{med.unit}</Text>
              <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:2 }} numberOfLines={2}>{med.uses}</Text>

              {/* Stock bar */}
              <View style={{ marginVertical:10 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:4 }}>
                  <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>Stock</Text>
                  <Text style={{ fontSize:FONT.xs, color:stc, fontWeight:'600' }}>{med.stock}%</Text>
                </View>
                <View style={{ height:4, backgroundColor:C.border, borderRadius:2 }}>
                  <View style={{ height:4, borderRadius:2, backgroundColor:stc, width:`${med.stock}%` }} />
                </View>
              </View>

              <Text style={{ fontSize:FONT.lg, fontWeight:'800', color:C.text, marginBottom:10 }}>{med.price}</Text>

              <TouchableOpacity onPress={() => tog(med.id)}
                style={[s.addBtn, inC && { backgroundColor:C.green, borderColor:C.green }]}>
                <Ionicons name={inC?'checkmark':'add'} size={14} color={inC?C.white:C.primary} />
                <Text style={[s.addBtnTxt, inC && { color:C.white }]}>{inC?'Added':'Add to Cart'}</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
      />

      {/* Cart Modal */}
      <Modal visible={cartOpen} transparent animationType="slide" onRequestClose={() => setCartOpen(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <Text style={s.sheetTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setCartOpen(false)}>
                <Ionicons name="close" size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>
            {cart.length === 0
              ? <View style={{ alignItems:'center', paddingVertical:32 }}>
                  <Ionicons name="bag-outline" size={40} color={C.textMuted} />
                  <Text style={{ color:C.textMuted, marginTop:10, fontSize:FONT.base }}>Your cart is empty</Text>
                </View>
              : <>
                  {cart.map(id => {
                    const m = MEDICINES.find(x => x.id===id);
                    return (
                      <View key={id}>
                        <View style={{ flexDirection:'row', alignItems:'center', paddingVertical:12 }}>
                          <View style={[s.iconCircle, { backgroundColor:C.primaryLight }]}>
                            <Ionicons name="medkit-outline" size={16} color={C.primary} />
                          </View>
                          <View style={{ flex:1, marginLeft:12 }}>
                            <Text style={{ fontWeight:'600', color:C.text, fontSize:FONT.sm }}>{m.name}</Text>
                            <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:1 }}>{m.unit}</Text>
                          </View>
                          <Text style={{ color:C.green, fontWeight:'700', marginRight:12, fontSize:FONT.sm }}>{m.price}</Text>
                          <TouchableOpacity onPress={() => tog(id)}>
                            <Ionicons name="trash-outline" size={18} color={C.red} />
                          </TouchableOpacity>
                        </View>
                        <Divider />
                      </View>
                    );
                  })}
                  <PrimaryButton
                    label="Place Order"
                    icon="checkmark-outline"
                    style={{ marginTop:16 }}
                    onPress={() => { setCart([]); setCartOpen(false); Alert.alert('Order Placed!','Your order is confirmed. (Demo)'); }}
                  />
                </>
            }
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── BLOOD BANK ──────────────────────────────────────────────────
function BloodScreen() {
  const [tab, setTab] = useState('find');
  const [selB, setSelB] = useState(null);
  const [form, setForm] = useState({ name:'', blood:'A+', phone:'' });
  const [done, setDone] = useState(false);
  const donors = selB ? DONORS.filter(d => d.blood===selB) : DONORS;

  const tabs = [
    { id:'find',    label:'Find Donor',   icon:'search-outline'    },
    { id:'request', label:'Request',      icon:'warning-outline'   },
    { id:'donate',  label:'Donate',       icon:'heart-outline'     },
  ];

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Blood Bank" subtitle="Find donors · Request blood" />

      {/* Tab bar */}
      <View style={{ flexDirection:'row', paddingHorizontal:14, gap:8, paddingBottom:12 }}>
        {tabs.map(t => (
          <TouchableOpacity key={t.id} onPress={() => { setTab(t.id); setDone(false); }}
            style={[s.tabBtn, tab===t.id && { backgroundColor:C.red, borderColor:C.red }]}>
            <Ionicons name={t.icon} size={14} color={tab===t.id?C.white:C.textMuted} />
            <Text style={[s.tabBtnTxt, tab===t.id && { color:C.white }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding:14, gap:12 }} showsVerticalScrollIndicator={false}>

        {tab==='find' && <>
          <SectionLabel title="Select Blood Type to Filter" />
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
            {BLOOD_TYPES.map(b => (
              <TouchableOpacity key={b.type} onPress={() => setSelB(t => t===b.type ? null : b.type)}
                style={[s.bloodTypeCard, selB===b.type && { backgroundColor:C.redLight, borderColor:C.red }]}>
                <Text style={{ fontSize:FONT.lg, fontWeight:'900', color:C.red }}>{b.type}</Text>
                <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:2 }}>{b.units} units</Text>
                <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{b.donors} donors</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionLabel title={`Donors${selB ? ` · ${selB}` : ''}`} />
          {donors.map((d, i) => (
            <Card key={i}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Avatar name={d.name} size={44} color={C.red} />
                <View style={{ flex:1, marginLeft:12 }}>
                  <Text style={{ fontWeight:'700', color:C.text, fontSize:FONT.base }}>{d.name}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:4, marginTop:3 }}>
                    <Ionicons name="location-outline" size={12} color={C.textMuted} />
                    <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{d.city} · Last donated {d.last}</Text>
                  </View>
                </View>
                <Pill label={d.blood} color={C.red} bg={C.redLight} />
              </View>
              <OutlineButton
                label={`Call ${d.phone}`} icon="call-outline" color={C.primary}
                onPress={() => Linking.openURL(`tel:${d.phone}`)}
                style={{ marginTop:12 }}
              />
            </Card>
          ))}
        </>}

        {(tab==='request'||tab==='donate') && (
          <Card>
            {done
              ? <View style={{ alignItems:'center', paddingVertical:24 }}>
                  <View style={[s.iconCircle, { width:64, height:64, borderRadius:32, backgroundColor:C.greenLight, marginBottom:14 }]}>
                    <Ionicons name="checkmark-circle" size={36} color={C.green} />
                  </View>
                  <Text style={[s.sheetTitle, { textAlign:'center' }]}>{tab==='request'?'Request Submitted!':'Registered as Donor!'}</Text>
                  <Text style={{ color:C.textMuted, textAlign:'center', marginBottom:20, lineHeight:20 }}>
                    {tab==='request'?'We will contact matching donors shortly.':'Thank you! We will reach out when needed.'}
                  </Text>
                  <PrimaryButton label="Submit Another" onPress={() => setDone(false)} color={C.red} style={{ width:'100%' }} />
                </View>
              : <>
                  <Text style={s.sectionTitle}>{tab==='request'?'Blood Request':'Donor Registration'}</Text>
                  <View style={{ height:12 }} />
                  <Text style={s.fieldLabel}>FULL NAME</Text>
                  <TextInput style={[s.formInput, { marginBottom:12 }]} placeholder="Your full name"
                    placeholderTextColor={C.textMuted} value={form.name} onChangeText={v => setForm(f => ({ ...f, name:v }))} />
                  <Text style={s.fieldLabel}>BLOOD TYPE</Text>
                  <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                    {BLOOD_TYPES.map(b => (
                      <TouchableOpacity key={b.type} onPress={() => setForm(f => ({ ...f, blood:b.type }))}
                        style={[s.slotChip, form.blood===b.type && { backgroundColor:C.red, borderColor:C.red }]}>
                        <Text style={[s.slotChipTxt, form.blood===b.type && { color:C.white }]}>{b.type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={s.fieldLabel}>PHONE</Text>
                  <TextInput style={[s.formInput, { marginBottom:20 }]} placeholder="03XX-XXXXXXX"
                    placeholderTextColor={C.textMuted} keyboardType="phone-pad"
                    value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone:v }))} />
                  <PrimaryButton
                    label={tab==='request'?'Submit Request':'Register as Donor'}
                    icon={tab==='request'?'warning-outline':'heart-outline'}
                    color={C.red}
                    onPress={() => { if(form.name&&form.phone) setDone(true); else Alert.alert('Missing Fields','Please fill in all fields.'); }}
                  />
                </>
            }
          </Card>
        )}
        <View style={{ height:20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── NEARBY ──────────────────────────────────────────────────────
function NearbyScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);

  const typeConfig = {
    doctor:   { color:C.primary, bg:C.primaryLight, icon:'person-outline'   },
    pharmacy: { color:C.green,   bg:C.greenLight,   icon:'medkit-outline'   },
    hospital: { color:C.red,     bg:C.redLight,     icon:'business-outline' },
  };

  const list = NEARBY.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
       !p.spec.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Nearby" subtitle="Healthcare in Lahore" />

      <View style={{ padding:14, gap:10 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search places…" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8 }}>
          {[['all','All'],['doctor','Doctors'],['pharmacy','Pharmacies'],['hospital','Hospitals']].map(([v,l]) => (
            <FilterChip key={v} label={l} active={filter===v} onPress={() => { setFilter(v); setActive(null); }} />
          ))}
        </ScrollView>
      </View>

      {/* Summary row */}
      <View style={{ flexDirection:'row', paddingHorizontal:14, gap:8, marginBottom:10 }}>
        {Object.entries(typeConfig).map(([type,cfg]) => (
          <Card key={type} style={{ flex:1, flexDirection:'row', alignItems:'center', gap:8, padding:10 }}>
            <View style={[s.iconCircle, { backgroundColor:cfg.bg, width:32, height:32, borderRadius:16 }]}>
              <Ionicons name={cfg.icon} size={15} color={cfg.color} />
            </View>
            <View>
              <Text style={{ fontWeight:'900', fontSize:FONT.lg, color:cfg.color }}>{NEARBY.filter(p=>p.type===type).length}</Text>
              <Text style={{ fontSize:9, color:C.textMuted, textTransform:'capitalize' }}>{type}s</Text>
            </View>
          </Card>
        ))}
      </View>

      <FlatList
        data={list} keyExtractor={p => String(p.id)}
        contentContainerStyle={{ paddingHorizontal:14, paddingBottom:24, gap:10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item:p }) => {
          const isA = active===p.id;
          const cfg = typeConfig[p.type];
          return (
            <Card onPress={() => setActive(id => id===p.id ? null : p.id)}
              style={isA && { borderColor:cfg.color, borderWidth:1.5 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
                <View style={[s.iconCircle, { backgroundColor:cfg.bg, width:46, height:46, borderRadius:14 }]}>
                  <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                </View>
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:'700', color:C.text, fontSize:FONT.base }}>{p.name}</Text>
                  <Text style={{ fontSize:FONT.xs, color:C.textMuted, marginTop:2 }}>{p.spec}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:4, marginTop:3 }}>
                    <Ionicons name="location-outline" size={11} color={C.textMuted} />
                    <Text style={{ fontSize:FONT.xs, color:C.textMuted }}>{p.addr}, Lahore</Text>
                  </View>
                </View>
                <View style={{ alignItems:'flex-end', gap:4 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:3 }}>
                    <Ionicons name="star" size={11} color={C.amber} />
                    <Text style={{ fontSize:FONT.xs, fontWeight:'600', color:C.textSec }}>{p.rating}</Text>
                  </View>
                  <Pill label={p.dist} color={cfg.color} bg={cfg.bg} />
                </View>
              </View>

              {isA && (
                <View style={{ marginTop:14, gap:8 }}>
                  <Divider />
                  <View style={{ flexDirection:'row', gap:8, marginTop:6 }}>
                    <PrimaryButton label="Directions" icon="navigate-outline" style={{ flex:1 }}
                      onPress={() => Linking.openURL(`https://www.google.com/maps/dir/31.5204,74.3587/${p.lat},${p.lng}`)} />
                    <OutlineButton label="Maps" icon="map-outline" style={{ flex:1 }}
                      onPress={() => Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(p.name)}`)} />
                  </View>
                  <OutlineButton
                    label={p.type==='pharmacy'?'View Medicines':'Book Appointment'}
                    icon={p.type==='pharmacy'?'medkit-outline':'calendar-outline'}
                    onPress={() => navigation.navigate(p.type==='pharmacy'?'Pharmacy':'Doctors')}
                  />
                </View>
              )}
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:       { flex:1, backgroundColor:C.bg },

  header:       { backgroundColor:C.surface, paddingHorizontal:16, paddingTop:12, paddingBottom:12,
                  borderBottomWidth:1, borderBottomColor:C.border, flexDirection:'row',
                  alignItems:'center', justifyContent:'space-between', ...shadow(1) },
  headerTitle:  { fontSize:FONT.xl, fontWeight:'800', color:C.text, letterSpacing:-0.3 },
  headerSub:    { fontSize:FONT.xs, color:C.textMuted, marginBottom:2 },

  card:         { backgroundColor:C.surface, borderRadius:14, padding:14,
                  borderWidth:1, borderColor:C.border, ...shadow(2) },

  statCard:     { width:150, borderRadius:16, padding:16, ...shadow(1) },
  actionCard:   { borderRadius:14, padding:16, minHeight:100 },

  searchBar:    { flexDirection:'row', alignItems:'center', backgroundColor:C.surface,
                  borderRadius:12, borderWidth:1, borderColor:C.border,
                  paddingHorizontal:12, paddingVertical:10, gap:8, ...shadow(1) },
  searchInput:  { flex:1, fontSize:FONT.base, color:C.text, padding:0 },

  filterChip:   { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1,
                  borderColor:C.border, backgroundColor:C.surface },
  filterChipTxt:{ fontSize:FONT.xs, color:C.textMuted },

  primaryBtn:   { borderRadius:10, paddingVertical:13, paddingHorizontal:20,
                  flexDirection:'row', alignItems:'center', justifyContent:'center' },
  primaryBtnTxt:{ color:C.white, fontWeight:'700', fontSize:FONT.base },

  outlineBtn:   { borderRadius:10, paddingVertical:12, paddingHorizontal:16,
                  borderWidth:1.5, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  outlineBtnTxt:{ fontWeight:'600', fontSize:FONT.sm },

  slotChip:     { paddingHorizontal:12, paddingVertical:7, borderRadius:8, borderWidth:1,
                  borderColor:C.border, backgroundColor:C.surfaceAlt },
  slotChipTxt:  { fontSize:FONT.xs, color:C.textSec },

  addBtn:       { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:5,
                  paddingVertical:8, borderRadius:8, borderWidth:1.5,
                  borderColor:C.primary, backgroundColor:C.primaryLight },
  addBtnTxt:    { fontSize:FONT.xs, fontWeight:'600', color:C.primary },

  iconCircle:   { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center' },

  overlay:      { flex:1, backgroundColor:'rgba(15,23,42,0.5)', justifyContent:'flex-end' },
  sheet:        { backgroundColor:C.surface, borderTopLeftRadius:24, borderTopRightRadius:24,
                  padding:24, borderTopWidth:1, borderTopColor:C.border, ...shadow(8) },
  sheetTitle:   { fontSize:FONT.xl, fontWeight:'800', color:C.text },

  formInput:    { backgroundColor:C.surfaceAlt, borderRadius:10, borderWidth:1,
                  borderColor:C.border, paddingHorizontal:14, paddingVertical:12,
                  fontSize:FONT.base, color:C.text },
  fieldLabel:   { fontSize:FONT.xs, color:C.textMuted, fontWeight:'600', letterSpacing:0.8,
                  textTransform:'uppercase', marginBottom:6 },

  infoBox:      { flexDirection:'row', alignItems:'center', backgroundColor:C.surfaceAlt,
                  borderRadius:12, padding:12, borderWidth:1, borderColor:C.border },

  tabBtn:       { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center',
                  gap:5, paddingVertical:9, borderRadius:10, borderWidth:1.5,
                  borderColor:C.border, backgroundColor:C.surface },
  tabBtnTxt:    { fontSize:FONT.xs, fontWeight:'600', color:C.textMuted },

  bloodTypeCard:{ width:(SW-56)/4, backgroundColor:C.surface, borderRadius:12, borderWidth:1,
                  borderColor:C.border, padding:10, alignItems:'center', ...shadow(1) },

  sectionTitle: { fontSize:FONT.base, fontWeight:'700', color:C.text },

  badge:        { position:'absolute', top:-4, right:-4, width:16, height:16,
                  borderRadius:8, backgroundColor:C.red, alignItems:'center', justifyContent:'center' },

  chatInput:    { backgroundColor:C.surface, borderRadius:22, borderWidth:1,
                  borderColor:C.border, paddingHorizontal:16, paddingVertical:10,
                  fontSize:FONT.base, color:C.text, maxHeight:100 },
  inputRow:     { flexDirection:'row', padding:12, borderTopWidth:1, borderTopColor:C.border,
                  backgroundColor:C.surface, alignItems:'flex-end', gap:8 },
  sendBtn:      { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center' },

  userBubble:   { backgroundColor:C.primary, borderRadius:18, borderBottomRightRadius:4, padding:12 },
  botBubble:    { backgroundColor:C.surface, borderRadius:18, borderBottomLeftRadius:4,
                  padding:12, borderWidth:1, borderColor:C.border, ...shadow(1) },

  emergencyBanner:{ backgroundColor:C.surface, borderRadius:14, padding:14, borderWidth:1,
                    borderColor:C.redMid, flexDirection:'row', alignItems:'center',
                    justifyContent:'space-between', ...shadow(1) },
});

// ─── NAVIGATION ──────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabelStyle: { fontSize:10, fontWeight:'600', marginBottom:4 },
            tabBarStyle: {
              backgroundColor: C.surface,
              borderTopColor: C.border,
              borderTopWidth: 1,
              height: 64,
              paddingTop: 6,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: C.primary,
            tabBarInactiveTintColor: C.textMuted,
          }}>
          <Tab.Screen name="Home" component={HomeScreen}
            options={{ tabBarIcon:({color,size})=><Ionicons name="home-outline" size={size} color={color} /> }} />
          <Tab.Screen name="Chat" component={ChatScreen}
            options={{ tabBarLabel:'AI Chat', tabBarIcon:({color,size})=><Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> }} />
          <Tab.Screen name="Doctors" component={DoctorsScreen}
            options={{ tabBarIcon:({color,size})=><Ionicons name="person-outline" size={size} color={color} /> }} />
          <Tab.Screen name="Pharmacy" component={PharmacyScreen}
            options={{ tabBarIcon:({color,size})=><Ionicons name="medkit-outline" size={size} color={color} /> }} />
          <Tab.Screen name="Blood" component={BloodScreen}
            options={{ tabBarIcon:({color,size})=><Ionicons name="water-outline" size={size} color={color} /> }} />
          <Tab.Screen name="Nearby" component={NearbyScreen}
            options={{ tabBarIcon:({color,size})=><Ionicons name="location-outline" size={size} color={color} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}