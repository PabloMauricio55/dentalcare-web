import type { PeriodValues, ReportDefinition } from "../models/report";

const v = (hoy: number, semana: number, mes: number, trimestre: number): PeriodValues => ({ hoy, semana, mes, trimestre });

export const reportDefinitions: ReportDefinition[] = [
  {
    key: "operativo",
    title: "Resumen operativo",
    description: "Actividad general de la clínica: atenciones, ocupación e ingresos del período.",
    indicators: [
      { id: "op1", label: "Pacientes atendidos", helper: "Atenciones completadas", format: "number", values: v(14, 78, 312, 918) },
      { id: "op2", label: "Ocupación de agenda", helper: "Horas ocupadas sobre disponibles", format: "percent", values: v(82, 76, 74, 71) },
      { id: "op3", label: "Ingresos del período", helper: "Cobros registrados en caja", format: "currency", values: v(4850, 26400, 108750, 318600) },
      { id: "op4", label: "Duración promedio", helper: "Por atención", format: "duration", values: v(42, 45, 46, 47) },
    ],
    charts: [
      { id: "opc1", title: "Citas por estado", description: "Distribución de las citas del período.", kind: "bar", format: "number", points: [
        { label: "Atendidas", values: v(14, 78, 312, 918) },
        { label: "Confirmadas", values: v(5, 22, 74, 196) },
        { label: "Canceladas", values: v(2, 9, 38, 104) },
        { label: "Inasistencias", values: v(1, 7, 29, 86) },
      ] },
      { id: "opc2", title: "Atenciones por área", description: "Participación de cada área clínica.", kind: "donut", format: "number", points: [
        { label: "Consulta", values: v(6, 31, 121, 352) },
        { label: "Restauración", values: v(4, 24, 96, 289) },
        { label: "Cirugía", values: v(2, 11, 47, 141) },
        { label: "Prevención", values: v(2, 12, 48, 136) },
      ] },
    ],
    table: { title: "Actividad por área", description: "Atenciones e ingresos generados por cada área.", unit: "currency", totalLabel: "Total de ingresos", rows: [
      { id: "opr1", label: "Consulta", detail: "Evaluación y diagnóstico", values: v(900, 4650, 18150, 52800) },
      { id: "opr2", label: "Restauración", detail: "Resinas y reconstrucciones", values: v(1900, 11400, 45600, 137200) },
      { id: "opr3", label: "Cirugía", detail: "Extracciones y procedimientos", values: v(1300, 7150, 30550, 91650) },
      { id: "opr4", label: "Prevención", detail: "Profilaxis y sellantes", values: v(750, 3200, 14450, 36950) },
    ] },
  },
  {
    key: "finanzas",
    title: "Finanzas",
    description: "Ingresos, formas de pago, saldos pendientes y ticket promedio.",
    indicators: [
      { id: "fi1", label: "Ingresos cobrados", helper: "Pagos y abonos aplicados", format: "currency", values: v(4850, 26400, 108750, 318600) },
      { id: "fi2", label: "Saldo pendiente", helper: "Cuentas por cobrar", format: "currency", values: v(2175, 9840, 34200, 61400) },
      { id: "fi3", label: "Ticket promedio", helper: "Por paciente atendido", format: "currency", values: v(346, 338, 348, 347) },
      { id: "fi4", label: "Recuperación", helper: "Cobrado sobre facturado", format: "percent", values: v(69, 73, 76, 84) },
    ],
    charts: [
      { id: "fic1", title: "Ingresos por forma de pago", description: "Solo el efectivo afecta el arqueo de caja.", kind: "donut", format: "currency", points: [
        { label: "Efectivo", values: v(1950, 9800, 39600, 114800) },
        { label: "Tarjeta", values: v(1750, 10250, 42300, 126400) },
        { label: "Transferencia", values: v(900, 5100, 21450, 63900) },
        { label: "Cheque", values: v(250, 1250, 5400, 13500) },
      ] },
      { id: "fic2", title: "Ingresos por semana", description: "Evolución del cobro dentro del período.", kind: "line", format: "currency", points: [
        { label: "S1", values: v(980, 5400, 24600, 72400) },
        { label: "S2", values: v(1120, 6300, 26800, 79300) },
        { label: "S3", values: v(1310, 7250, 28150, 82600) },
        { label: "S4", values: v(1440, 7450, 29200, 84300) },
      ] },
    ],
    table: { title: "Ingresos por procedimiento", description: "Procedimientos que más aportan al ingreso del período.", unit: "currency", totalLabel: "Total cobrado", rows: [
      { id: "fir1", label: "Restauración con resina", detail: "PROC-014", values: v(1425, 8075, 32300, 96900) },
      { id: "fir2", label: "Extracción simple", detail: "PROC-022", values: v(1300, 7150, 30550, 91650) },
      { id: "fir3", label: "Profilaxis dental", detail: "PROC-030", values: v(1050, 5250, 21000, 63000) },
      { id: "fir4", label: "Evaluación odontológica", detail: "PROC-001", values: v(750, 3900, 15600, 46800) },
      { id: "fir5", label: "Blanqueamiento dental", detail: "PROC-041", values: v(325, 2025, 9300, 20250) },
    ] },
  },
  {
    key: "citas",
    title: "Citas e inasistencias",
    description: "Cumplimiento de la agenda, cancelaciones y motivos de inasistencia.",
    indicators: [
      { id: "ci1", label: "Citas agendadas", helper: "Total del período", format: "number", values: v(22, 116, 453, 1304) },
      { id: "ci2", label: "Citas atendidas", helper: "Con atención registrada", format: "number", values: v(14, 78, 312, 918) },
      { id: "ci3", label: "Inasistencias", helper: "Pacientes que no llegaron", format: "number", values: v(1, 7, 29, 86) },
      { id: "ci4", label: "Tasa de inasistencia", helper: "Sobre citas confirmadas", format: "percent", values: v(5, 6, 6, 7) },
    ],
    charts: [
      { id: "cic1", title: "Citas por día de la semana", description: "Carga de agenda distribuida en la semana.", kind: "bar", format: "number", points: [
        { label: "Lunes", values: v(22, 24, 96, 268) },
        { label: "Martes", values: v(0, 21, 88, 254) },
        { label: "Miércoles", values: v(0, 26, 101, 289) },
        { label: "Jueves", values: v(0, 23, 92, 262) },
        { label: "Viernes", values: v(0, 22, 76, 231) },
      ] },
      { id: "cic2", title: "Origen de la solicitud", description: "Por dónde entran las citas.", kind: "donut", format: "number", points: [
        { label: "Portal del paciente", values: v(9, 44, 171, 486) },
        { label: "Teléfono", values: v(8, 41, 163, 478) },
        { label: "Presencial", values: v(5, 31, 119, 340) },
      ] },
    ],
    table: { title: "Motivos de inasistencia", description: "Registrados por secretaría al reprogramar.", unit: "number", totalLabel: "Total de inasistencias", rows: [
      { id: "cir1", label: "Sin aviso", detail: "El paciente no se comunicó", values: v(1, 3, 13, 38) },
      { id: "cir2", label: "Motivo laboral", detail: "Reprogramada por el paciente", values: v(0, 2, 8, 24) },
      { id: "cir3", label: "Problema de salud", detail: "Justificada", values: v(0, 1, 5, 15) },
      { id: "cir4", label: "Otro", detail: "Sin clasificar", values: v(0, 1, 3, 9) },
    ] },
  },
  {
    key: "procedimientos",
    title: "Procedimientos y tratamientos",
    description: "Procedimientos realizados, planes de tratamiento y avance clínico.",
    indicators: [
      { id: "pr1", label: "Procedimientos realizados", helper: "Registrados en expediente", format: "number", values: v(18, 94, 372, 1086) },
      { id: "pr2", label: "Planes activos", helper: "En ejecución", format: "number", values: v(31, 31, 34, 41) },
      { id: "pr3", label: "Tratamientos finalizados", helper: "Cerrados en el período", format: "number", values: v(3, 14, 52, 147) },
      { id: "pr4", label: "Aceptación de presupuesto", helper: "Presupuestos aprobados", format: "percent", values: v(74, 71, 68, 66) },
    ],
    charts: [
      { id: "prc1", title: "Procedimientos por categoría", description: "Volumen por tipo de procedimiento.", kind: "bar", format: "number", points: [
        { label: "Restauración", values: v(7, 34, 138, 402) },
        { label: "Prevención", values: v(5, 26, 101, 298) },
        { label: "Cirugía", values: v(3, 18, 72, 214) },
        { label: "Consulta", values: v(3, 16, 61, 172) },
      ] },
    ],
    table: { title: "Procedimientos más realizados", description: "Los procedimientos con mayor volumen del período.", unit: "number", totalLabel: "Total de procedimientos", rows: [
      { id: "prr1", label: "Restauración con resina", detail: "PROC-014 · 60 min", values: v(6, 28, 112, 328) },
      { id: "prr2", label: "Profilaxis dental", detail: "PROC-030 · 45 min", values: v(5, 24, 94, 276) },
      { id: "prr3", label: "Evaluación odontológica", detail: "PROC-001 · 30 min", values: v(4, 22, 89, 258) },
      { id: "prr4", label: "Extracción simple", detail: "PROC-022 · 45 min", values: v(3, 20, 77, 224) },
    ] },
  },
  {
    key: "inventario",
    title: "Inventario y costos",
    description: "Consumo de insumos, órdenes de compra y costo asociado a la atención.",
    indicators: [
      { id: "in1", label: "Consumo de insumos", helper: "Valorizado al costo", format: "currency", values: v(640, 3480, 14200, 41900) },
      { id: "in2", label: "Órdenes de compra", helper: "Emitidas en el período", format: "number", values: v(1, 4, 11, 29) },
      { id: "in3", label: "Ítems bajo mínimo", helper: "Requieren reposición", format: "number", values: v(6, 6, 9, 14) },
      { id: "in4", label: "Costo por atención", helper: "Insumos sobre atenciones", format: "currency", values: v(46, 45, 46, 46) },
    ],
    charts: [
      { id: "inc1", title: "Consumo por categoría", description: "Dónde se va el gasto de insumos.", kind: "bar", format: "currency", points: [
        { label: "Descartables", values: v(280, 1520, 6180, 18200) },
        { label: "Restauración", values: v(210, 1140, 4660, 13750) },
        { label: "Anestesia", values: v(95, 520, 2130, 6280) },
        { label: "Esterilización", values: v(55, 300, 1230, 3670) },
      ] },
      { id: "inc2", title: "Estado del stock", description: "Distribución de los ítems del inventario.", kind: "donut", format: "number", points: [
        { label: "Disponible", values: v(48, 48, 46, 44) },
        { label: "Bajo mínimo", values: v(6, 6, 9, 14) },
        { label: "Por vencer", values: v(3, 3, 5, 8) },
      ] },
    ],
    table: { title: "Insumos de mayor consumo", description: "Ordenados por valor consumido en el período.", unit: "currency", totalLabel: "Total consumido", rows: [
      { id: "inr1", label: "Resina compuesta A2", detail: "Restauración", values: v(185, 1010, 4120, 12150) },
      { id: "inr2", label: "Guantes de nitrilo", detail: "Descartables", values: v(160, 870, 3540, 10420) },
      { id: "inr3", label: "Anestesia lidocaína 2%", detail: "Anestesia", values: v(95, 520, 2130, 6280) },
      { id: "inr4", label: "Campos descartables", detail: "Descartables", values: v(120, 650, 2640, 7780) },
      { id: "inr5", label: "Bolsas de esterilización", detail: "Esterilización", values: v(80, 430, 1770, 5270) },
    ] },
  },
  {
    key: "esterilizacion",
    title: "Instrumental y esterilización",
    description: "Cargas procesadas, trazabilidad del instrumental y cumplimiento de protocolos.",
    indicators: [
      { id: "es1", label: "Cargas procesadas", helper: "Ciclos completados", format: "number", values: v(4, 21, 86, 248) },
      { id: "es2", label: "Sets esterilizados", helper: "Instrumental liberado", format: "number", values: v(26, 138, 552, 1610) },
      { id: "es3", label: "Ciclos observados", helper: "Con control fuera de rango", format: "number", values: v(0, 1, 3, 9) },
      { id: "es4", label: "Cumplimiento", helper: "Ciclos conformes", format: "percent", values: v(100, 95, 97, 96) },
    ],
    charts: [
      { id: "esc1", title: "Cargas por tipo de ciclo", description: "Distribución de los ciclos del período.", kind: "bar", format: "number", points: [
        { label: "Autoclave 134°", values: v(3, 15, 62, 178) },
        { label: "Autoclave 121°", values: v(1, 5, 20, 58) },
        { label: "Químico", values: v(0, 1, 4, 12) },
      ] },
    ],
    table: { title: "Trazabilidad por set", description: "Sets con más ciclos registrados.", unit: "number", totalLabel: "Total de ciclos", rows: [
      { id: "esr1", label: "Set de operatoria", detail: "12 piezas", values: v(2, 9, 36, 104) },
      { id: "esr2", label: "Set de cirugía", detail: "18 piezas", values: v(1, 5, 21, 62) },
      { id: "esr3", label: "Set de profilaxis", detail: "8 piezas", values: v(1, 5, 20, 58) },
      { id: "esr4", label: "Instrumental de diagnóstico", detail: "6 piezas", values: v(0, 2, 9, 24) },
    ] },
  },
  {
    key: "rendimiento",
    title: "Rendimiento profesional",
    description: "Productividad por profesional: atenciones, ingresos generados y ocupación.",
    indicators: [
      { id: "re1", label: "Profesionales activos", helper: "Con agenda en el período", format: "number", values: v(3, 4, 4, 4) },
      { id: "re2", label: "Atenciones por profesional", helper: "Promedio del período", format: "number", values: v(5, 20, 78, 230) },
      { id: "re3", label: "Ingreso por profesional", helper: "Promedio generado", format: "currency", values: v(1617, 6600, 27188, 79650) },
      { id: "re4", label: "Ocupación promedio", helper: "Horas ocupadas sobre disponibles", format: "percent", values: v(82, 76, 74, 71) },
    ],
    charts: [
      { id: "rec1", title: "Atenciones por profesional", description: "Volumen atendido por cada odontólogo.", kind: "bar", format: "number", points: [
        { label: "Dra. Elena Castillo", values: v(6, 28, 112, 328) },
        { label: "Dr. Andrés Morales", values: v(5, 22, 86, 254) },
        { label: "Dra. Karina Ruiz", values: v(3, 18, 71, 208) },
        { label: "Dr. Julio Estrada", values: v(0, 10, 43, 128) },
      ] },
    ],
    table: { title: "Desempeño por profesional", description: "Ingresos generados por cada profesional en el período.", unit: "currency", totalLabel: "Total generado", rows: [
      { id: "rer1", label: "Dra. Elena Castillo", detail: "Odontología general", values: v(2050, 9850, 40100, 117400) },
      { id: "rer2", label: "Dr. Andrés Morales", detail: "Cirugía oral", values: v(1600, 7600, 30600, 90200) },
      { id: "rer3", label: "Dra. Karina Ruiz", detail: "Rehabilitación", values: v(1200, 6100, 24700, 72800) },
      { id: "rer4", label: "Dr. Julio Estrada", detail: "Odontopediatría", values: v(0, 2850, 13350, 38200) },
    ] },
  },
];
