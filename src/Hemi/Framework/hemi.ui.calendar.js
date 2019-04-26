/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002 - 2003, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

/// <source>
/// <name>Hemi.ui.calendar</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.ui.calendar</path>
///		<library>Hemi</library>
///		<description>The Calendar control is a date picker control.</description>
///		<static-class>
///			<name>Calendar</name>
///			<version>%FILE_VERSION%</version>
///			<description>Visual representation of a date.</description>
///			<version>%FILE_VERSION%</version>
///			<method>
///				<name>newInstance</name>
///				<param name = "o" type = "HTMLNode">Parent HTML Node in which the control will be created.</param>
///				<description>Creates a new Calendar .</description>
///				<return-value name = "u" type = "CalendarInstance">Instance of a Calendar control.</return-value>
///			</method>
///	 </static-class>

/// <class>
///		<name>CalendarInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>A control for displaying the date.</description>
(function(){

	HemiEngine.namespace("ui.calendar", HemiEngine, {
		dependencies : ["hemi.ui.wideselect","hemi.ui.util","hemi.task"],
		newInstance:function(o, d){
			/*
				o = object parent
			*/
			var n = HemiEngine.newObject("caltasche","%FILE_VERSION%");

	
			if(typeof o != DATATYPES.TYPE_OBJECT) o = document.body;
			
			n.objects = {

					/* parent_object */
					p:o,
					/* c = container  */
					c:0,
					/* h = header */
					h:0,
					/* b = body */
					b:0,
					/* f = footer */
					f:0,
					/* d = date selector */
					d:0,
					/* dc = calendar days array */
					dc:0,
					/* cl = cell labels */
					cl:0,
					/* cn = clear node */
					cn:0,
	
					/* pt = panel-tasks */
					pt:0,
					/* ptl = panel-tasks-labels */
					ptl:0,
					/* ptt = panel-tasks-items  - contains task list control*/
					ptt:0,
					/* pta = panel-tasks-add */
					pta:0,
					/* tl = task list control */
					tl:0,
					/* ts = task service */
					ts:0,
					/* ti = task items */
					ti:[],
					/* tim = task items map */
					tim:[],
					/* tpn - task pagenavigate next */
					tpn:0,
					/* tpp - task pagenavigate previous */
					tpp:0,
	
					
					/* panel-calendar */
					pc:0,
					/* label-footer */
					lf:0,
					/* label-header */
					lh:0,
					/* left-header control set */
					lhc:0,
					/* right-header control set */
					rhc:0,

					/* names of months */
					m:"January,February,March,April,May,June,July,August,September,October,November,December",
	
					/* names of days */
					d:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
	
					/* days in months */
					s:[31,29,31,30,31,30,31,31,30,31,30,31],
	
					
					SECOND:0,
					MINUTE:0,
					HOUR:0,
					DAY:0,
					WEEK:0,
	
					/* current time is the browsable time */
					current_time:0,
	
					/* base time is the actual time */
					base_time:0
			};
				n.properties = {
					cell_label_clip_size:0,
					clear_node:"caltasche_clear_node",
					class_container:"caltasche_class_container",
					header_container:"caltasche_header_container",
					footer_label:"caltasche_footer_label",
					header_label:"caltasche_header_label",
					header_left_control:"caltasche_header_left_control",
					header_right_control:"caltasche_header_right_control",
					header_control_label:"caltasche_header_control_label",
					header_control_label_hover:"caltasche_header_control_label_hover",
					body_container:"caltasche_body_container",
					footer_container:"caltasche_footer_container",
					calendar_panel:"caltasche_calendar_panel",
					calendar_cell:"caltasche_calendar_cell",
					calendar_lastmonth_cell:"caltasche_calendar_lastmonth_cell",
					calendar_nextmonth_cell:"caltasche_calendar_nextmonth_cell",
					calendar_thismonth_cell:"caltasche_calendar_thismonth_cell",
					calendar_baseday_cell:"caltasche_calendar_baseday_cell",
					calendar_currentday_cell:"caltasche_calendar_currentday_cell",
					calendar_cell_hover:"caltasche_calendar_cell_hover",
					calendar_cell_label:"caltasche_calendar_cell_label",
	
	
					task_panel:"caltasche_task_panel",
					task_add:"caltasche_task_add",
					task_item:"caltasche_task_item",
					task_item_border:"caltasche_task_item_border",
					task_column:"caltasche_task_column",
					task_column_border:"caltasche_task_column_border",
					task_column_label:"caltasche_task_column_label",
					task_bullet_column:"caltasche_task_bullet_column",
					task_name_column:"caltasche_task_name_column",
					task_completed_date_column:"caltasche_task_completed_date_column",
					task_overdue_column:"caltasche_task_overdue_column",
	
					
					cell_count:35,
					cell_rows:6,
					cell_columns:7,
					day_of_week:0,
	
	
					gmt_offset:0,
					current_year:0,
					current_month:0,
					current_day:0,
					current_hour:0,
					current_minute:0,
					current_second:0,
					current_millisecond:0,
					
					base_year:0,
					base_month:0,
					base_day:0,
					base_hour:0,
					base_minute:0,
					base_second:0,
					base_millisecond:0,
	
					last_month_days:0,
					next_month_days:0,
					first_day_in_month:0,
					last_day_in_month:0,
					
					auto_render:0,
					render_ui:1,
					is_calendar_rendered:0,
					render_calendar:1,
					show_calendar:0,
	
					is_tasks_rendered:0,
					render_tasks:1,
	
					show_tasks:0,
					/*show_tasks_list:1,*/
					/*show_tasks_add:0,*/
					show_task_controls:0,
	
					
					/* start the show controls in the off state so they can be drawn; set to 0 when the controls are nuked */
					show_calendar_controls:0,
					
					is_rendered:0
				
			};
	
			n.init=function(){
				var t = this, _p, _d;
	
				_p = t.objects;
				_d = t.objects;
				
				t.ready_state = 4;
	
				/*
					Setup static values			
				*/			
	
				_d.SECOND = 1000;
				_d.MINUTE = _d.SECOND * 60;
				_d.HOUR = _d.MINUTE * 60;
				_d.DAY = _d.HOUR * 24;
				_d.WEEK = _d.DAY * 7;
	
				/*
					Extend class to use the event buffer API
				*/
				HemiEngine.event.addScopeBuffer(t);
				t.scopeHandler("control_label_mouseout",0,0,1);
				t.scopeHandler("control_label_mouseover",0,0,1);
	
				if(t.properties.auto_render)
					t.render();
			
				/* apply the current date object to internal values */
				t.applyDate();
				
			};
			
	
			n.render = function(){
				/* create the core HTML used for the control */
				var t = this, _s;
				_s = t.properties;
				if(!_s.is_rendered && _s.render_ui){
					t.createUI();
					if(_s.render_calendar){
						/* create the HTML used to display the calendar grid */
						t.createCalendar();
						if(!_s.show_calendar) t.hideCalendar();
					}
					
					if(_s.render_tasks){
						t.createTasks();
						if(!_s.show_tasks) t.hideTasks();
						/*if(!_s.show_tasks_add) t.hideTasksAdd();*/
					}
					
					return 1;
				}
				return 0;
				
			};
			
			n.createUI = function(){
				var t = this, _s, _p, f, b, h, lh, lf;
				_s = t.properties;
				_p = t.objects;
				
				_p.cn = document.createElement("div");
				_p.cn.className = _s.clear_node;
	/*			_p.cn.style.clear = "left";*/
	
	
				o = document.createElement("div");
				b = _p.b = o.cloneNode(false);
				h = o.cloneNode(false);
	
				lh = _p.lh = document.createElement("span");
				lhc = _p.lhc = lh.cloneNode(false);
				rhc = _p.rhc = lh.cloneNode(false);
				lf = _p.lf = lh.cloneNode(true);
				
				f = o.cloneNode(false);
	/*			p = _p.pc = o.cloneNode(false);*/
				
				o.className = _s.class_container;
				h.className = _s.header_container;
				lh.className = _s.header_label;
				lhc.className = _s.header_left_control;
				rhc.className = _s.header_right_control;
				lf.className = _s.footer_label;
				b.className = _s.body_container;
				f.className = _s.footer_container;
	/*			p.className = _s.calendar_panel;*/
				
				_p.p.appendChild(o);
				o.appendChild(h);
				o.appendChild(b);
				o.appendChild(f);
	/*			b.appendChild(_p.pc);*/
				
				h.appendChild(lhc);
				h.appendChild(lh);
				h.appendChild(rhc);
				h.appendChild(_p.cn.cloneNode(false));
				
				f.appendChild(lf);
				
				_p.c = o;		
			};
			n.setMonthLabels = function(s){
				this.objects.m = s;
			};
			n.setDayLabels = function(s){
				this.objects.d = s;
			};

			n.refreshUI = function(){
				var t = this, _s;
				_s = t.properties;
	
				if(_s.show_calendar){
					t.refreshCalendar();
				}		
	
				if(_s.show_tasks){
					t.refreshTasks();
				}
				
			};
			
			n.refreshDate = function(b){
				/*
					b = bit passed along to set date
				*/
				var t = this;
				t.objects.base_time = new Date();
				t.setDate(t.objects.base_time,b);
			};
	
			n.updateDate = function(){
				var t = this,o,_s;
				_s = t.properties;
				t.setDate(new Date(_s.current_year, _s.current_month, _s.current_day, _s.current_hour, _s.current_minute, _s.current_second));
			};
			n.getDate = function(){
				return this.objects.current_time;
			};
			n.setDate = function(o,b){
				/*
					o = date object
					b = skip applying date
				*/
				if(typeof o == DATATYPES.TYPE_OBJECT){
					this.objects.current_time = o;
					if(!b) this.applyDate();
					return 1;
				}
				return 0;
			};
			
			n.applyDate = function(){
				var t = this, _s, _d, o;
	
				_s = t.properties;
				_d = t.objects;
				o = _d.current_time;
	
				_s.day_of_week = o.getDay();
				_s.current_day = o.getDate();
				_s.current_year = o.getFullYear();
				_s.current_month = o.getMonth();
				_s.gmt_offset = o.getTimezoneOffset();
	
				_s.current_hour = o.getHours();
				_s.current_minute=  o.getMinutes();
				_s.current_second = o.getSeconds();
				_s.current_millisecond = o.getMilliseconds();
	
				/* correct for leap year */
				_d.s[1] = (((!(_s.current_year % 4)) && (_s.current_year % 100) ) || !(_s.current_year % 400)) ? 29 : 28;
	
				_s.last_month_days = _d.s[ ((_s.current_month - 1) == 0 ? 12 : _s.current_month - 1) - 1];
				_s.next_month_days = _d.s[ ((_s.current_month + 1) == 13 ? 1 : _s.current_month + 1) - 1];
				
				_s.first_day_in_month = new Date(_s.current_year,_s.current_month).getDay();
				_s.last_day_in_month = new Date(_s.current_year,_s.current_month+1).getDay() - 1;
	
				if(_s.last_day_in_month < 0) _s.last_day_in_month += 7;
				
				/*
					Base time is kept for a point of reference
				*/
				o = _d.base_time;
				_s.base_year = o.getFullYear();
				_s.base_month = o.getMonth();
				_s.base_day = o.getDate();
				_s.base_hour = o.getHours();
				_s.base_minute = o.getMinutes();
				_s.base_second = o.getSeconds();
				_s.base_millisecond = o.getMilliseconds();
				
				t.refreshUI();
				
				return 1;
			};
			
			n.getCurrentYear = function(){
				return this.properties.current_year;
			};
			n.setCurrentYear = function(i){
				this.properties.current_year = i;
			};
	
			n.getCurrentMonth = function(){
				return this.properties.current_month;
			};
			n.setCurrentMonth = function(i){
				this.properties.current_month = i;
			};
	
			n.getCurrentDay = function(){
				return this.properties.current_day;
			};
			n.setCurrentDay = function(i){
				this.properties.current_day = i;
			};
	
	
			n.getDaysInMonth = function(i){
				if(typeof i != DATATYPES.TYPE_NUMBER || i < 0 || i > 11) return -1;
				return this.objects.s[i];
			};
	
			n.getCurrentHour = function(){
				return this.properties.current_hour;
			};
			n.getCurrentMinute = function(){
				return this.properties.current_minute;
			};
			n.getCurrentSecond = function(){
				return this.properties.current_second;
			};
			n.getCurrentMillisecond = function(){
				return this.properties.current_millisecond;
			};
	
			n.getCellCount = function(){
				return this.properties.cell_count;
			};
	
			
			n.clearLabels = function(){
				this.clearHeader();
				this.clearFooter();
				this.clearControls();
			};
			
			n.clearControls = function(){
				HemiEngine.xml.removeChildren(this.objects.rhc);		
				HemiEngine.xml.removeChildren(this.objects.lhc);
				this.properties.show_calendar_controls = 0;
				
				
				this.properties.show_task_controls = 0;
				
			};
			
			n.clearFooter = function(){
				HemiEngine.xml.removeChildren(this.objects.lf);
			};
			n.clearHeader = function(){
				HemiEngine.xml.removeChildren(this.objects.lh);
			};
			
			/*
				General UI
			*/
			
			n.hideAllPanels = function(){
				var t = this;
				if(t.properties.show_calendar) t.hideCalendar();
	
				if(t.properties.show_tasks) t.hideTasks();
	/*			if(t.properties.show_tasks_list) t.hideTasksList();*/
	/*			if(t.properties.show_tasks_add) t.hideTasksAdd();*/
			};
			
	
			/*
				TASKS UI
			*/
	
			n.showTasks = function(){
				var t = this;
				
				if(t.properties.render_tasks){
	
					t.hideAllPanels();
	
					t.properties.show_tasks = 1;
					t.objects.pt.style.display = "block";
					t.clearLabels();
					t.refreshTasks();
					return 1;
				}
				return 0;
			};
			
			n.hideTasks = function(){
				var t = this;
				if(t.properties.render_tasks){
					t.properties.show_tasks = 0;
					t.objects.pt.style.display = "none";
					t.clearLabels();
	
					return 1;
				}
				return 0;
			};
	
	/*
			n.showTasksList = function(){
				var t = this;
				
				if(t.properties.render_tasks){
	
					t.hideAllPanels();
					t.showTasks();
	
					t.properties.show_tasks_list = 1;
					t.objects.ptl.style.display = "block";
					t.objects.ptt.style.display = "block";
					t.clearLabels();
					t.refreshTasksList();
					return 1;
				}
				return 0;
			};
			
			n.hideTasksList = function(){
				var t = this;
				if(t.properties.render_tasks){
					t.properties.show_tasks_list = 0;
					t.objects.ptl.style.display = "none";
					t.objects.ptt.style.display = "none";
					t.clearLabels();
					return 1;
				}
				return 0;
			};
	
			n.showTasksAdd = function(){
				var t = this;
				
				if(t.properties.render_tasks){
	
					t.hideAllPanels();
					t.showTasks();
					
					t.properties.show_tasks_add = 1;
					t.objects.pta.style.display = "block";
					t.clearLabels();
					t.refreshTasksAdd();
					return 1;
				}
				return 0;
			};
			
			n.hideTasksAdd = function(){
				var t = this;
				if(t.properties.render_tasks){
					t.properties.show_tasks_add = 0;
					t.objects.pta.style.display = "none";
					t.clearLabels();
					return 1;
				}
				return 0;
			};
	*/
	/*
			n.refreshTasksAdd = function(b){
	
				var t = this, _p, _s, _x = HemiEngine.xml, o, i, s, c = document.createElement, a;
				
				_s = t.properties;
				_p = t.objects;
			
				_x.removeChildren(_p.pta);
				
				o = c("p");
				i = c("span");
	
				_p.pta.appendChild(o);
				o.appendChild(i);
				i.appendChild(document.createTextNode("Start"));
	
				i.setAttribute("task-start");
	
				_e.addEventListener(i,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(i,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(i,"click",t._prehandle_add_task,0);
	
				
				_x.setInnerXHTML(_p.lh,"Add Task",0,0,0,1,1);
				_x.setInnerXHTML(_p.lf,"Now: " + (_s.base_month + 1) + "/" + _s.base_day + "/" + _s.base_year + " | Cur: " + (_s.current_month + 1) + "/" + _s.current_day + "/" + _s.current_year,0,0,0,1,1);
	
				
			};
	*/
	
			n.refreshTasks = function(b){
				/*
					b = bit skip refresh paged display
				*/
				var t = this, _p, _s, _x = HemiEngine.xml;
				
				_s = t.properties;
				_p = t.objects;
				_x.setInnerXHTML(_p.lh,"Tasks",0,0,0,1,1);
				_x.setInnerXHTML(_p.lf,"Now: " + (_s.base_month + 1) + "/" + _s.base_day + "/" + _s.base_year + " | Cur: " + (_s.current_month + 1) + "/" + _s.current_day + "/" + _s.current_year,0,0,0,1,1);
	
				t.showTaskListControls();
			
				if(_s.show_task_controls){
	
					/* set display based on available movement */
					_p.tpp.style.display = (_p.tl.getCanMovePrevious() ? "block" : "none");
					_p.tpn.style.display = (_p.tl.getCanMoveNext() ? "block" : "none");
	
					/* reset class names in case items are hidden so they aren't shown again with the highlights */
					_p.tpp.className = _s.header_control_label;
					_p.tpn.className = _s.header_control_label;
	
				}
				
				if(!b && _p.tl.getCurrentPageItemCount() > 0){
					_p.tl.updatePage();
				}
	/*			_x.setInnerXHTML(_p.lf,"Cur: " + (_s.current_month + 1) + "/" + _s.current_day + "/" + _s.current_year);*/
			};
			
			n.clearTasks = function(){
				var t = this, _p, _s,o, b, p, l;
			
				_p = t.objects;
				_s = t.properties;
	
				/* don't add the item if the task panel is not rendered */
				if(!_s.is_tasks_rendered) return 0;
				
				_p.tl.clearItems();
				_p.ti = [];
				_p.tim = [];
				
				return 1;		
			};
			
			n.addTask = function(i, n, d, c){
				/*
					i = id
					n = name  (string)
					d = due date (long milliseconds)
					c = completed (bit)
				*/
				var t = this, _p, _s,o, b, p, l;
			
				_p = t.objects;
				_s = t.properties;
	
				/* don't add the item if the task panel is not rendered */
				if(!_s.is_tasks_rendered) return 0;
				
				/* does task already exist in the list ? */
				if(_p.tim[i])
					return 0;
					
	
	
				/* DEBGU
	 			_p.tl.addItem(n, i);
				_p.tl.updatePage();
				
				
				l = _p.ti.length;
				_p.tim[i] = l;
				_p.ti[l] = {i:i,n:n,d:d,c:c};
				return;
				*/
				p = document.createElement("div");
				b = document.createElement("span");
	
				o = b.cloneNode(false);
				o.className = _s.task_bullet_column + " " + _s.task_column + " " + _s.task_column_border;
				o.appendChild(document.createTextNode("+"));
				p.appendChild(o);
				
				o = b.cloneNode(false);
				o.className = _s.task_name_column + " " + _s.task_column + " " + _s.task_column_border;
				o.appendChild(document.createTextNode(n));
				p.appendChild(o);
	
				o = b.cloneNode(false);
				o.className = _s.task_completed_date_column + " " + _s.task_column + " " + _s.task_column_border;
				o.appendChild(document.createTextNode("yes"));
				p.appendChild(o);
	
				o = b.cloneNode(false);
				o.className = _s.task_overdue_column + " " + _s.task_column + " " + _s.task_column_border;
				o.appendChild(document.createTextNode("+"));
				p.appendChild(o);
				
				p.appendChild(_p.cn.cloneNode(true));
	
				/* add task item to the UI */
	 			
				_p.tl.pageItem(p,i);
				/*_p.tl.updatePage();*/
				
				l = _p.ti.length;
				_p.tim[i] = l;
				_p.ti[l] = {i:i,n:n,d:d,c:c};
				
			};
			
			n.showTaskListControls = function(){
	
				var t = this, _s, _p, lb, rb,_e=HemiEngine.event;
				_s = t.properties;
				_p = t.objects;
	
				/* if the controls are visible, then just return */
				if(_s.show_task_controls) return 0;
				
				_p.tpp = lb = document.createElement("span");
	/*			_p.tpp.setAttribute("type","button");*/
				_p.tpn = rb = lb.cloneNode(false);
	
				_e.addEventListener(lb,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(lb,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(lb,"click",t._prehandle_task_pageback,0);
				
				_e.addEventListener(rb,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(rb,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(rb,"click",t._prehandle_task_pagenext,0);
				
				lb.className = _s.header_control_label;
				rb.className = _s.header_control_label;
	/*
				lb.setAttribute("value","<");
				rb.setAttribute("value",">");
	*/			
				_p.lhc.appendChild(lb);
				_p.rhc.appendChild(rb);
	
	
				lb.appendChild(document.createTextNode("<"));
				rb.appendChild(document.createTextNode(">"));
	
	
				
				_s.show_task_controls = 1;
			};
	
	
			n.createTasks = function(){
				var t = this, _p, _s,_e = HemiEngine.event, o, b;
			
				_p = t.objects;
				_s = t.properties;
		
				if(!_s.render_tasks || _s.is_tasks_rendered) return 0;
				
				/* add tasks panel */
				_p.pt = document.createElement("div");
				_p.ptl = _p.pt.cloneNode(false);
				_p.ptt = _p.pt.cloneNode(false);
				_p.pta = _p.pt.cloneNode(false);
	
				_p.b.appendChild(_p.pt);
				_p.pt.className = _s.task_panel;
				_p.pta.className = _s.task_add;
				_p.pta.style.display = "none";
				
				_p.pt.appendChild(_p.ptl);
				_p.pt.appendChild(_p.ptt);
				_p.pt.appendChild(_p.pta);
				
				_p.ptl.className = _s.task_item + " " + _s.task_item_border;
				b = document.createElement("span");
	
				/* Add in the labels */
				o = b.cloneNode(false);
				o.className = _s.task_bullet_column + " " + _s.task_column + " " + _s.task_column_label;
				o.appendChild(document.createTextNode("B"));
				_p.ptl.appendChild(o);
				
				o = b.cloneNode(false);
				o.className = _s.task_name_column + " " + _s.task_column + " " + _s.task_column_label;
				o.appendChild(document.createTextNode("name"));
				_p.ptl.appendChild(o);
				
				o = b.cloneNode(false);
				o.className = _s.task_completed_date_column + " " + _s.task_column + " " + _s.task_column_label;
				o.appendChild(document.createTextNode("com"));
				_p.ptl.appendChild(o);
	
				o = b.cloneNode(false);
				o.className = _s.task_overdue_column + " " + _s.task_column + " " + _s.task_column_label;
				o.appendChild(document.createTextNode("late"));
				_p.ptl.appendChild(o);
				
				_p.ptl.appendChild(_p.cn.cloneNode(true));
				
							
				t.scopeHandler("task_click",0,0,1);
				t.scopeHandler("task_pageback",0,0,1);
				t.scopeHandler("task_pagenext",0,0,1);
				t.scopeHandler("task_pagenavigate",0,0,1);
				t.scopeHandler("task_add",0,0,1);
	
				_p.tl = HemiEngine.ui.wideselect.newInstance(_p.ptt,t._prehandle_task_click, t._prehandle_task_pagenavigate);
				_p.tl.setIsPaging(1);
				_p.tl.setIsBuffered(0);
				_p.tl.setPageStop(1);
				_p.ts = new HemiEngine.task.serviceImpl();
					/*new org.cote.js.task.TaskServiceImpl();*/
	
				_s.is_tasks_rendered = 1;
			
				return 1;
			};
			
	
			n._handle_task_add = function(s, v){
				
			};
	
			n._handle_task_pagenavigate = function(s, v){
				this.refreshTasks(1);
			};
			
			n._handle_task_pageback = function(s, v){
				var t = this, _p;
				_p = t.objects;
				if(!_p.tl.getCanMovePrevious()) return 0;
				_p.tl.movePrevious();
			};
			n._handle_task_pagenext = function(s, v){
				var t = this, _p;
				_p = t.objects;
				if(!_p.tl.getCanMoveNext()) return 0;
				_p.tl.moveNext();		
			};
			
			n._handle_task_click = function(s, v){
				var t = this, _p, r, i, o, _x = HemiEngine.xml;
				_p = t.objects;
	
				if(_p.tl.getActiveItem() == null || (!v && !v.data)){
					t.refreshTasks();
					return 0;
				}
				i = v.data;
				if(typeof _p.tim[i] != DATATYPES.TYPE_NUMBER) return 0;
				o = _p.ti[_p.tim[i]];
				if(!o.c){
					_x.setInnerXHTML(_p.lf,o.n + " incomplete.",0,0,0,0,1);
				}
				else{
					_x.setInnerXHTML(_p.lf,o.n + " complete.",0,0,0,0,1);
				}
	
			};
	
			
			/*
				CALENDAR UI
			*/
			
			n.showCalendarControls = function(){
	
				var t = this, _s, _p, lb, rb,_e=HemiEngine.event;
	
				_s = t.properties;
				_p = t.objects;
	
				/* if the controls are visible, then just return */
				if(_s.show_calendar_controls) return 0;
				
				lb = document.createElement("span");
				rb = lb.cloneNode(false);
	
				lb.setAttribute("move-month","-1");
				rb.setAttribute("move-month","1");
	
				_e.addEventListener(lb,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(lb,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(lb,"click",t._prehandle_navigate_month,0);
				
				_e.addEventListener(rb,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(rb,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(rb,"click",t._prehandle_navigate_month,0);
				
				lb.className = _s.header_control_label;
				rb.className = _s.header_control_label;
				
				_p.lhc.appendChild(lb);
				_p.rhc.appendChild(rb);
	
				lb.appendChild(document.createTextNode("<"));
				rb.appendChild(document.createTextNode(">"));
	
				_s.show_calendar_controls = 1;
	
			};
			
			n.showCalendar = function(){
				var t = this;
	
				if(t.properties.render_calendar){
	
					t.hideAllPanels();
	
					t.properties.show_calendar = 1;
					t.objects.pc.style.display = "block";
					t.clearLabels();
					t.refreshCalendar();
					return 1;
				}
	
				return 0;
			};
			
			n.hideCalendar = function(){
				var t = this;
				if(t.properties.render_calendar){
					t.properties.show_calendar = 0;
					t.objects.pc.style.display = "none";
					t.clearLabels();
					return 1;
				}
				return 0;
			};
			
			n.refreshCalendar = function(){
				var t = this, _p, _s, _d, o, a, i = 0, j, c = 0, cd = 0, bc, ld, bd, db, fd, m, _x, dl, lm, nm, ly, ny,_e=HemiEngine.event;
				
	
				/*
					c = current count
					cd = current day count
					i = row count
					j = column count
				*/
				_s = t.properties;
				_d = t.objects;
				_p = t.objects;
	
				if(!_s.render_calendar || !_s.show_calendar) return 0;
	
				_x = HemiEngine.xml;
	
				m = _s.current_month;
	
				/* days in this month */
				ld = _d.s[m];
	
				/* lm = last month */
				lm = (m > 0 ? m - 1 : 11);
				ly = (lm == 11 ? _s.current_year - 1 : _s.current_year);
	
				/* nm = next month */
				nm = (m < 11 ? m + 1 : 0);
				ny = (nm == 0 ? _s.current_year + 1 : _s.current_year);
	
				/* days in last month */
				bd = _d.s[ lm ];
				fd = _s.first_day_in_month;
	
				/* number of days to subtract from the days in the last month */
				/* if zero, set to 7 so the first week is bumped down one row */
				db = (fd ? fd : _s.cell_columns);
	
				for(; i < _s.cell_rows;i++){
					for(j = 0; j < _s.cell_columns; j++){
						o = _p.dc[i][j];
						dl = "";
						bc = "";
	
						/* if this is the first cell, and no previous days are being shown, then be sure to bump up the current day */
						if(cd == 0 && db == 0) cd++;
						
						/* walk up from the last month to the current month */
						if(db > 0){
							/*
								2004/11/02
								Missing day for previous month; was not including the last day (eg: 31)
							*/
							dl = bd - (db-1);
	
							bc = _s.calendar_lastmonth_cell;
							db--;
							o.setAttribute("month",lm);
							o.setAttribute("year",ly);
						}
						
						/* check for the next month */
						else if(cd  > ld){
							bc = _s.calendar_nextmonth_cell;
							dl = c - ld - (fd ? fd : _s.cell_columns) + 1;/*cd - ld*/;
							o.setAttribute("month",nm);
							o.setAttribute("year",ny);
						}
	
						/*
							handle the current day
							make sure this is only applicable if the current_month is the base month and the current_year is the base_year.
						*/
						else{
							dl = cd;
							if(cd == _s.current_day){
								bc = _s.calendar_currentday_cell;
							}
							else if(_s.base_year == _s.current_year && _s.base_month == _s.current_month && cd == _s.base_day){
								bc = _s.calendar_baseday_cell;
							}
							else{
								bc = _s.calendar_thismonth_cell;
							}
							o.setAttribute("month",_s.current_month);
							o.setAttribute("year", _s.current_year);
						}
	
						o.setAttribute("day",dl);
	
						o.className = _s.calendar_cell + " " + bc;
						o.setAttribute("base-class",bc);
						c++;
						if(db <= 0 && cd  <= ld){
	/*					if(i >= _s.first_day_in_month && cd < _s.last_day_in_month){*/
							cd++;
						}
	
						/* set day label */
						_x.setInnerXHTML(o,"" + dl,0,0,0,0,1);
	
					}
				}
				
				o = document.createElement("span");
				o.appendChild(document.createTextNode("Now:" + (_s.base_month + 1) + "/" + _s.base_day + "/" + _s.base_year));
				_e.addEventListener(o,"mouseover",t._prehandle_control_label_mouseover,0);
				_e.addEventListener(o,"mouseout",t._prehandle_control_label_mouseout,0);
				_e.addEventListener(o,"click",t._prehandle_navigate_basedate,0);
				o.className = _s.header_control_label;
				
				_x.setInnerXHTML(_p.lh,_d.m.split(",")[_s.current_month] + " " + _s.current_year,0,0,0,1,1);
	
				_x.removeChildren(_p.lf);
				_p.lf.appendChild(o);
				_x.setInnerXHTML(_p.lf," | Cur: " + (_s.current_month + 1) + "/" + _s.current_day + "/" + _s.current_year,1,0,0,1,1);
	
				t.showCalendarControls();
	
				return 1;
			
			};
			
			n.createCalendar = function(){
				var t = this, _p, o, _s, f, b, h, p, i, j,c,l,tl,_e=HemiEngine.event;
			
				_p = t.objects;
				_s = t.properties;
		
				if(!_s.render_calendar || _s.is_calendar_rendered) return 0;
				
				/* add calendar panel */
				_p.pc = document.createElement("div");
				_p.b.appendChild(_p.pc);
				_p.pc.className = _s.calendar_panel;
	
				t.scopeHandler("navigate_basedate",0,0,1);
				t.scopeHandler("navigate_month",0,0,1);
				t.scopeHandler("cell_mouseover",0,0,1);
				t.scopeHandler("cell_mouseout",0,0,1);
				t.scopeHandler("cell_click",0,0,1);
				
				_p.dc = [];
				_p.cl = [];
				c = t.objects.d.split(",");
				tl = _s.cell_label_clip_size;
	
				for(i = 0; i < _s.cell_columns;i++){
					l = c[i];
					if(l.length > tl && tl > 0) l = l.substring(0,tl);
					
					o = _p.cl[i] = document.createElement("span");
					o.appendChild(document.createTextNode(l));
					_p.pc.appendChild(o);
					o.className = _s.calendar_cell_label;
				}
	
				for(i = 0; i < _s.cell_rows;i++){
					o = _p.dc[i] = [];
					for(j = 0; j < _s.cell_columns;j++){
						o[j] = document.createElement("span");
						_p.pc.appendChild(o[j]);
						_e.addEventListener(o[j],"mouseover",t._prehandle_cell_mouseover,0);
						_e.addEventListener(o[j],"mouseout",t._prehandle_cell_mouseout,0);
						_e.addEventListener(o[j],"click",t._prehandle_cell_click,0);
						
					}
				}
	
				/* add in the clear */
				_p.pc.appendChild(_p.cn.cloneNode(false));
				
				_s.is_calendar_rendered = 1;
				
				return 1;
	
			};
			
			/*
				EVENT HANDLERS
			*/
	
	
			n._handle_cell_mouseover = function(v){
				var t=this,o,e,bc;
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				bc = o.getAttribute("base-class");
				if(!bc) bc = "";
				o.className = t.properties.calendar_cell + " " + bc + " " + t.properties.calendar_cell_hover;
			};
	
			n._handle_cell_mouseout = function(v){
				var t=this,o,e,bc;
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				bc = o.getAttribute("base-class");
				if(!bc) bc = "";
				o.className = t.properties.calendar_cell + " " + bc;
			};		
	
			n._handle_cell_click = function(v){
				var t=this,o,e,_p,_s, m, d, y;
	
				_s = t.properties;
				_p = t.objects;
	
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				
				m = o.getAttribute("month");
				d = o.getAttribute("day");
				y = o.getAttribute("year");
	
				if(
					typeof m != DATATYPES.TYPE_UNDEFINED && m != null
					&&
					typeof d != DATATYPES.TYPE_UNDEFINED && d != null
					&&
					typeof y != DATATYPES.TYPE_UNDEFINED && y != null
				){
					m = parseInt(m);
					d = parseInt(d);
					t.setCurrentMonth(m);
					t.setCurrentDay(d);
					t.setCurrentYear(y);
					t.updateDate();
					HemiEngine.message.service.publish("ondatechanged",t);
					HemiEngine.message.service.publish("onselectdate",t);
				}
			};
	
	
			n._handle_control_label_mouseover = function(v){
				var t=this,o,e;
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				o.className = t.properties.header_control_label + " " + t.properties.header_control_label_hover;
			};
	
			n._handle_control_label_mouseout = function(v){
				var t=this,o,e;
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				o.className = t.properties.header_control_label;
			};		
	
			n._handle_navigate_basedate = function(v){
				this.refreshDate();
			};
	
			n._handle_navigate_month = function(v){
				var t=this,o,e, i;
				e=HemiEngine.event.getEvent(v);
				o=(typeof v != DATATYPES.TYPE_UNDEFINED && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				i = o.getAttribute("move-month");
				if(i){
					i = parseInt(i);
					t.setCurrentMonth(t.properties.current_month + i);
					t.updateDate();
					HemiEngine.message.service.publish("ondatechanged",t);
				}
	
			};
	
			n._handle_window_destroy=function(){
				this.destroy();
			};
			
			n.destroy=function(){
				var t=this,c;
				c=t.objects;
				if(t.ready_state == 4){
					c.p.removeChild(c.c);
					HemiEngine.registry.service.removeObject(t);
				}
				t.ready_state = 0;
			};
			
			n.refreshDate(1);
	
			n.init();
	
			HemiEngine.registry.service.addObject(n);
	
			return n;
		}
	});
}());

/// </class>
/// </package>
/// </source>
