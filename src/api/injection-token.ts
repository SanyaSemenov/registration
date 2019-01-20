import { InjectionToken } from '@angular/core';
import { ApiInjection } from './api-injection.interface';
import { BehaviorSubject } from 'rxjs';

export const API_CONFIG = new InjectionToken<BehaviorSubject<ApiInjection>>('api.service');

export const REMOTE_API: ApiInjection = {
    endpoint: 'https://ch.invend.ru/api',
    mock: false
};

export const MOCK_API: ApiInjection = {
    endpoint: '/assets/mock',
    mock: true
};
