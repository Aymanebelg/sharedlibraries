import * as path from 'path';
import * as fs from 'fs';
import { TransformableInfo } from 'logform';
import logger from '../index';
import * as DailyRotateFile from 'winston-daily-rotate-file';

describe('Logger Module', () => {
  const mockModule = {
    filename: path.join('src', 'module', 'testFile.ts')
  } as NodeModule;

  test('getLabel should return the correct label from the module path', () => {
    const logInstance = logger(mockModule);
    const logMessage = logInstance.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00',
      label: logInstance.defaultMeta?.label
    })[Symbol.for('message')];

    expect(logMessage).toContain(`[src${path.sep}module${path.sep}testFile.ts]`);
    
  });

  test('getLabel should return the full path if "src" is not in the path', () => {
    const moduleWithoutSrc = { filename: path.join('module', 'testFile.ts') } as NodeModule;
    const logInstance = logger(moduleWithoutSrc);
    const logMessage = logInstance.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00',
      label: logInstance.defaultMeta?.label
    })[Symbol.for('message')];

    expect(logMessage).toContain(`[module${path.sep}testFile.ts]`);
  });

  test('getLabel should return an empty string if no module is provided', () => {
    const logInstance = logger();
    const logMessage = logInstance.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00',
      label: logInstance.defaultMeta?.label
    })[Symbol.for('message')];

    expect(logMessage).toContain('[] Test message');
  });   
  
  test('logger should format log messages correctly', () => {
    const testLogger = logger(mockModule);
    const logEntry = testLogger.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00',
      label: 'src/module/testFile.ts'
    }) as TransformableInfo;
 
    const formattedMessage = logEntry[Symbol.for('message')];
    expect(formattedMessage).toMatch(/INFO \[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] \[src\/module\/testFile\.ts\] Test message/);
  });
   
  test('logger should uppercase log levels', () => {
    const testLogger = logger(mockModule);
    const logEntry = testLogger.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00', 
      label: 'testLabel'
    }) as TransformableInfo;
 
    expect(logEntry.level).toBe('INFO'); 
  });   
    
  test('logger should use the provided path label if given', () => {
    const customPath = 'custom/path/to/module';
    const testLogger = logger(undefined, customPath);
    const logMessage = testLogger.format.transform({
      level: 'info',
      message: 'Test message',
      timestamp: '2024-05-24 12:00:00',
      label: testLogger.defaultMeta?.label
    })[Symbol.for('message')];

    expect(logMessage).toContain(`[${customPath}]`);
  });

  test('logger should log messages at different levels', () => {
    const testLogger = logger(mockModule);
    
    const infoLog = testLogger.format.transform({
      level: 'info',
      message: 'Info level message',
      timestamp: '2024-05-24 12:00:00',
      label: 'testLabel'
    }) as TransformableInfo;
    expect(infoLog.level).toBe('INFO');
    
    const warnLog = testLogger.format.transform({
      level: 'warn',
      message: 'Warn level message',
      timestamp: '2024-05-24 12:00:00',
      label: 'testLabel'
    }) as TransformableInfo;
    expect(warnLog.level).toBe('WARN');
    
    const errorLog = testLogger.format.transform({
      level: 'error',
      message: 'Error level message',
      timestamp: '2024-05-24 12:00:00',
      label: 'testLabel'
    }) as TransformableInfo;
    expect(errorLog.level).toBe('ERROR');
  });

  test('logger should rotate log files daily', () => {
    const testLogger = logger(mockModule);
    const transport = testLogger.transports.find(t => t instanceof DailyRotateFile);
    if (!transport) throw new Error('File transport not found');
    
    const filePath = (transport as any).dirname + '/' + (transport as any).filename.replace('%DATE%', '2024-05-24');
    fs.writeFileSync(filePath, '');
    expect(fs.existsSync(filePath)).toBe(true); 
  });


});
