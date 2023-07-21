'use strict';
/**
 * Version : 80.1
 */
const HEX_PADDING = 8;

//Process ID
const ID_PROCESS_MANAGER      = 0x00000001
const ID_SYSTEM_LOG           = 0x00000002
const ID_FOTA                 = 0x00000008
const ID_POWER_CONTROL        = 0x00000010
const ID_ALGORITHM_MANAGER    = 0x00000020
const ID_ESS_MANAGER          = 0x00000040
const ID_DC_SOURCE_MANAGER    = 0x00000080
const ID_CLOUD_MANAGER        = 0x00000100
const ID_METER_MANAGER        = 0x00000200
const ID_GATEWAY_MANAGER      = 0x00000400
const ID_DATA_ACCUMULATOR     = 0x00000800
const ID_DB_MANAGER           = 0x00001000
const ID_WEB_BASE             = 0x00004000
const ID_SYS_MANAGER          = 0x00020000

class Process {
  constructor(processName, fileName, processId) {
    this.processName = processName;
    this.fileName = fileName;
    this.processId = processId;
  }

  get name() {
    return this.processName;
  }

  get filename() {
    return this.fileName;
  }

  get id() {
    return this.processId;
  }

  get code() {
    let hex = Number(this.processId).toString(16)
    return `0x${'0'.repeat(HEX_PADDING - hex.length) + hex}`;
  }

  toString() {
    return this.processName;
  }

  equals(obj) {
    if (obj instanceof Process) {
      return obj.id === this.id;
    }
    if (obj instanceof Number) {
      return obj === this.id;
    }
    if (obj instanceof String) {
      if (obj.startsWith('0x')) {
        return parseInt(obj, 16) === this.id;
      }
      return obj === this.name;
    }
    return false;
  }

  static of(value) {
    return Object.values(Processes).find(e => e.equals(value));
  }
}

const Processes = {
  PROCESS_MANAGER: new Process('PROCESS_MANAGER', 'processmgr', ID_PROCESS_MANAGER),
  SYSTEM_LOG: new Process('SYSTEM_LOG', 'systemlog', ID_SYSTEM_LOG),
  FOTA: new Process('FOTA', 'fota', ID_FOTA),
  POWER_CONTROL: new Process('POWER_CONTROL', 'powercontrol', ID_POWER_CONTROL),
  ALGORITHM_MANAGER: new Process('ALGORITHM_MANAGER', 'algomgr', ID_ALGORITHM_MANAGER),
  ESS_MANAGER: new Process('ESS_MANAGER', 'essmgr', ID_ESS_MANAGER),
  DC_SOURCE_MANAGER: new Process('DC_SOURCE_MANAGER', 'dcsourcemgr', ID_DC_SOURCE_MANAGER),
  CLOUD_MANAGER: new Process('CLOUD_MANAGER', 'cloudmgr', ID_CLOUD_MANAGER),
  METER_MANAGER: new Process('METER_MANAGER', 'metermgr', ID_METER_MANAGER),
  GATEWAY_MANAGER: new Process('GATEWAY_MANAGER', 'gatewaymgr', ID_GATEWAY_MANAGER),
  DATA_ACCUMULATOR: new Process('DATA_ACCUMULATOR', 'datamgr', ID_DATA_ACCUMULATOR),
  DB_MANAGER: new Process('DB_MANAGER', 'dbmgr', ID_DB_MANAGER),
  WEB_BASE: new Process('WEB_BASE', 'webbase', ID_WEB_BASE),
  SYSTEM_MANAGER: new Process('SYSTEM_MANAGER', 'systemmgr', ID_SYS_MANAGER),
}

/*===================================================================================================================*/

class HttpMethod {
  constructor(methodCode) {
    this.methodCode = methodCode;
  }

  get code() {
    return this.methodCode;
  }

  equals(obj) {
    if (obj instanceof HttpMethod) {
      return obj.code === this.code;
    }
    return false;
  }

  toString() {
    return this.methodCode;
  }

  static of(value) {
    return Object.values(HttpMethods).find(e => e.code === value);
  }
}

const HttpMethods = {
  GET: new HttpMethod('GET'),
  POST: new HttpMethod('POST'),
  PUT: new HttpMethod('PUT'),
  DELETE: new HttpMethod('DELETE'),
}

class Command {
  constructor(commandCode, commandTo, commandMethod, descriptions = '') {
    this.commandCode = commandCode;
    if (!(commandTo instanceof Process)) {
      throw 'TO parameter must be a instance of Process'
    }
    this.commandTo = commandTo;
    if (!(commandMethod instanceof HttpMethod)) {
      throw 'METHOD parameter must be a instance of HttpMethod'
    }
    this.commandMethod = commandMethod;
    this.commandId = parseInt(commandCode, 16);
    this.descriptions = descriptions;
  }

  get id() {
    return this.commandId;
  }

  get code() {
    return this.commandCode;
  }

  get to() {
    return this.commandTo;
  }

  get method() {
    return this.commandMethod.code;
  }

  get description() {
    return this.descriptions;
  }

  equals(obj) {
    if (obj instanceof Command) {
      return obj.id === this.id;
    }
    return false;
  }
}

const IPC_MAP = {
  // Request
  // Process Manager
  Reboot:                       { api : "reboot", id : '0x00000100', commandTo : Processes.PROCESS_MANAGER,  method : HttpMethods.POST },
  GetSystemRestartCount:        { id : '0x00000101', commandTo : Processes.PROCESS_MANAGER,  method : HttpMethods.POST },
  FactoryReset:                 { id : '0x00000102', commandTo : Processes.PROCESS_MANAGER,  method : HttpMethods.POST },

  // FOTA
  UpdateFirmware:               { id : '0x00000400', commandTo : Processes.FOTA,             method : HttpMethods.POST },

  // Power Control
  GetESSAllData:                { api : "ess-all-data", id : '0x00000500', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetPVInfo:                    { api : "pv-info", id : '0x00000501', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetMLPEInfo:                  { api : "mlpe-info", id : '0x00000502', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetInverterInfo:              { api : "inverter-info", id : '0x00000503', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetBatteryInfo:               { api : "battery-info", id : '0x00000504', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetMeterInfo:                 { api : "meter-info", id : '0x00000505', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetAllErrorInfo:              { api : "all-error-info", id : '0x00000506', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetPCSMode:                   { api : 'pcs-mode', id : '0x00000507', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetCommandControl:            { api : 'command-control', id : '0x00000508', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  SetPCSMode:                   { api : 'pcs-mode', id : '0x00000509', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  SetCommandControl:            { api : 'command-control', id : '0x0000050A', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  GetPCSSystemStatus:           { api : "pcs-system-status", id : '0x0000050B', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetRelayCountInfo:            { id : '0x0000050C', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  SetEMSError:                  { id : '0x0000050D', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  SetDR:                        { id : '0x00000510', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  GetDR:                        { id : '0x00000511', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetPowerAccumData:            { id : '0x00000514', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  SetSimulationMode:            { id : '0x00000515', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  GetSimulationMode:            { id : '0x00000516', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetEMSPowerStatus:            { id : '0x00000517', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  SetForceChargeDischargeMode:  { id : '0x00000518', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  SetAutoChargeDischargeMode:   { id : '0x00000519', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  GetForceChargeDischargeMode:  { id : '0x0000051A', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  GetAutoChargeDischargeMode:   { id : '0x0000051B', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },
  SetFaultTestConfig:           { id : '0x0000051C', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.POST },
  GetFaultTestConfig:           { id : '0x0000051D', commandTo : Processes.POWER_CONTROL,    method : HttpMethods.GET  },

  // ESS Manager
  SetPCSDebugCommand:           { api : "pcs-debug-command", id : '0x00000700', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetPCSDebugData:              { api : "pcs-debug-data", id : '0x00000701', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetPCSCalibrationData:        { id : '0x00000704', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  SetPCSCalibrationData:        { id : '0x00000705', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  ReleaseBMSProtection:         { id : '0x00000706', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetCanRawData:                { id : '0x00000707', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  SetDRMToESS:                  { id : '0x00000709', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetESSVersionInfo:            { id : '0x0000070A', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetESSConnectStatus:          { id : '0x0000070B', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetPCSNameplate:              { id : '0x0000070D', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  ReleasePCSProtection:         { id : '0x0000070E', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetBattSerialNumber:          { id : '0x0000070F', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  OperateBatterySync:           { id : '0x00000711', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetAFCICalibrationData:       { id : '0x00000717', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetAFCIVersionInfo:           { api : "afci-version-info", id : '0x0000071B', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetAFCIAllData:               { api : "afci-all-data", id : '0x0000071C', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetBDCCalibrationData:        { id : '0x0000071D', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetPCSCalibrationAcData:      { id : '0x00000721', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetPCSCalibrationDcData:      { id : '0x00000723', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetHubCalibrationData:        { id : '0x00000728', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  SetAFCICalibrationData:       { id : '0x00000718', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  SetBDCCalibrationData:        { id : '0x0000071E', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  SetPCSCalibrationAcData:      { id : '0x00000722', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  SetPCSCalibrationDcData:      { id : '0x00000724', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },
  GetHubVersionInfo:            { api : "hub-version-info", id : '0x0000072B', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  GetHubAllData:                { api : "hub-all-data", id : '0x0000072E', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.GET  },
  SetHubCalibrationData:        { id : '0x00000729', commandTo : Processes.ESS_MANAGER,      method : HttpMethods.POST },

  // Cloud Manager
  UploadLogData:                { id : '0x00000900', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.POST },
  GetLatestFWVersion:           { id : '0x00000901', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.GET  },
  DoUpdateToLatestFW:           { id : '0x00000902', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.POST },
  GetWeatherInfo:               { id : '0x00000903', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.GET  },
  GetCarbonRate:                { id : '0x00000904', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.GET  },
  GetCloudConnectStatus:        { id : '0x00000905', commandTo : Processes.CLOUD_MANAGER,    method : HttpMethods.GET  },

  // Meter Manager
  GetMeterConnectStatus:        { id : '0x00000A00', commandTo : Processes.METER_MANAGER,    method : HttpMethods.GET  },

  // Gateway Manager
  GetGWModelInfo:               { id : '0x00000B00', commandTo : Processes.GATEWAY_MANAGER,  method : HttpMethods.GET  },
  GetGatewayConnectStatus:      { id : '0x00000B01', commandTo : Processes.GATEWAY_MANAGER,  method : HttpMethods.GET  },

  // DB Manager
  LoginCheck:                   { id : '0x00000D02', commandTo : Processes.DB_MANAGER,       method : HttpMethods.POST },
  GetNVM:                       { id : '0x00000D03', commandTo : Processes.DB_MANAGER,       method : HttpMethods.GET  },
  SetNVM:                       { id : '0x00000D04', commandTo : Processes.DB_MANAGER,       method : HttpMethods.POST },
  GetAllNVM:                    { id : '0x00000D05', commandTo : Processes.DB_MANAGER,       method : HttpMethods.GET  },
  GetErrorHistory:              { id : '0x00000D08', commandTo : Processes.DB_MANAGER,       method : HttpMethods.GET  },

  // System Manager
  GetInternetConnectStatus:     { api : 'internet-connect-status', id : '0x00001100', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET  },
  GetSystemStatus:              { api : 'system-status', id : '0x00001101', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET  },
  ChangeEMSState:               { api : 'ems-status', id : '0x00001102', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  SetRTC:                       { api : 'rtc', id : '0x00001103', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  SetNTP:                       { api : 'ntp', id : '0x00001104', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  GetNTPStatus:                 { api : 'ntp-status', id : '0x00001105', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET },
  SetDateTime:                  { api : 'datetime', id : '0x00001106', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  SetTimeZone:                  { api : 'timezone', id : '0x00001107', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  GetTimeZone:                  { api : 'timezone', id : '0x00001108', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET },
  GetNetworkInfo:               { api : 'network-info', id : '0x00001109', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET },
  SetEthConfig:                 { api : 'eth-config', id : '0x00001110', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  GetWifiApList:                { api : 'wifi-ap-list', id : '0x00001111', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET },
  GetWifiConnectStatus:         { api : 'wifi-connect-status', id : '0x00001112', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.GET },
  SetWifiConnect:               { api : 'wifi-connect', id : '0x00001113', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },
  SetWifiDisconnect:            { api : 'wifi-disconnect', id : '0x00001114', commandTo : Processes.SYSTEM_MANAGER,   method : HttpMethods.POST },

  //REST API
  GetHeartBeat_WB:              { id : '0xF0000001', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  SetHeartBeat_WB:              { id : '0xF0000002', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  SetMeterData_WB:              { id : '0xF0000003', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  SetMeterData_PV_WB:           { id : '0xF0000004', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  GetDefaultGridCode_WB:        { id : '0xF0000005', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  GetEmsInfo_WB:                { id : '0xF0000009', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetTestStatusFlag_WB:         { id : '0xF000000B', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetLastFwUpdateDate_WB:       { id : '0xF000000F', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetNetworkInfo_WB:            { id : '0xF0000014', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  ConnectWifi_WB:               { id : '0xF0000015', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  GetWifiApList_WB:             { id : '0xF0000016', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  DisconnectWifi_WB:            { id : '0xF0000019', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  SetEth0_StaticIP_WB:          { id : '0xF000001A', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  SetEth0_DHCP_WB:              { id : '0xF000001B', commandTo : Processes.WEB_BASE,         method : HttpMethods.POST },
  GetDatetime_WB:               { id : '0xF000001D', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetEmsState_WB:               { id : '0xF0000020', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetEnergyControlMode_WB:      { id : '0xF0000024', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
  GetBattSerialNumber_WB:       { id : '0xF0000025', commandTo : Processes.WEB_BASE,         method : HttpMethods.GET  },
}

module.exports = {
  Process, Processes, HttpMethod, HttpMethods, Command, IPC_MAP
};
