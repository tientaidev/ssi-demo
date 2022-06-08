import { program } from 'commander';
import './did'
import './key'

if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  program.parse(process.argv)
}