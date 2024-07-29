import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExecuteService } from './execute.service';

@Controller('execute')
export class ExecuteController {
  constructor(private readonly executeService: ExecuteService) { }
}
