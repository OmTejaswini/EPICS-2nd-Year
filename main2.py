# print(graph)


# s = '[[4],[4],[4],[1,2,3]]'

# lst = ast.literal_eval(s)
# graph = [[1 if j+1 in neighbors else 0 for j in range(len(lst))] for neighbors in lst]

# print(graph)



# input_data = sys.argv[1]
# print(input_data)
# print("hello from python")
# input_data = sys.stdin.readline().rstrip()
# input_data = '[3],[3],[3],[0,1,2],[],[],[],[],[],[],[],[],[],[],[],[],[],[]'
# string = input_data
# print(input_data +"%^%^%^%^%^%^%^")
# pairs = string.split('],[')
# print(pairs)
# print(pairs[0] + "00000")
# print(pairs[1] + "1111111")
# graph = [[] for i in range(10)]
# i = 0
# for pair in pairs:
#     # print(pair.split(':'))
#     print(pair +"werty")
#     value = pair
#     print(value)
#     # print(key,value)
#     if(value != ''):
#         graph[i].append(eval(value))
#         i = i+1


# class GraphColoring: 

#     def _init_(self, graph):
#         self.graph = graph
#         self.result = []

#     def isComplete(self, graph):

#         for i in range(1, len(graph) + 1):
#             if graph[i][2][0] == 0:
#                 return False
        
#         return True

#     def isConsistent(self, graph, node, color):
        
#         for i in graph[node][0]:
#             if graph[i][2][0] == 0:
#                 continue
#             else:
#                 if graph[i][2][0] ==  color:
#                     return False
        
#         return True

#     def degreeHeuristic(self, graph):
        
#         high = -1
#         lenHigh = 0

#         for i in graph.keys():
#             if graph[i][2][0] != 0:
#                 continue
#             else:
#                 if len(graph[i][0]) > lenHigh:
#                     lenHigh = len(graph[i][0])
#                     high = i
#         return high

#     def minimumRemainingValuesHeuristic(self, graph):
#         low = []
#         lenLow = inf

#         for i in graph.keys():
#             if graph[i][2][0] != 0:
#                 continue
#             else:
#                 if len(graph[i][1]) <= lenLow:
#                     lenLow = len(graph[i][1])
#                     low.append(i)
            
#         if len(low) == 1:
#             return low[0]

#         newGraph = {i: graph[i] for i in low}
#         # print(newGraph, ">>>>>>")
#         return self.degreeHeuristic(newGraph)

#     def leastConstrainingValue(self, graph, node):

#         lcv = 0
#         lcvColor = 1
        
#         for color in graph[node][1]:
#             temp = 0
#             for neighbour in graph[node][0]:
#                 if graph[neighbour][2][0] != 0:
#                     continue
#                 if color in graph[neighbour][1]:
#                     temp += len(graph[neighbour][1]) - 1
#                 else:
#                     temp += len(graph[neighbour][1])
        
#             if temp >= lcv:
#                 lcv = temp
#                 lcvColor = color
        
#         return lcvColor


#     def selectUnassignedVariableMRV(self, graph):
#         return self.minimumRemainingValuesHeuristic(graph)


#     def forwardChecking(self, graph, node, color):
        
#         for neighbour in graph[node][0]:
#             if graph[neighbour][2][0] == 0 and color in graph[neighbour][1]:
#                 temp = len(graph[neighbour][1]) - 1
#                 if temp == 0:
#                     return False
        
#         return True

    
#     def arcConsistency(self, graph, node, color):

#         graph[node][1] = [color] 

#         q = []
        
#         for neighbour in graph[node][0]:
#             if graph[neighbour][2][0] == 0:
#                 q.append([node, neighbour])
#                 q.append([neighbour, node])

#         while (len(q) != 0):
#             x, y = q.pop(0)

#             for color1 in graph[x][1]:
#                 for color2 in graph[y][1]:
#                     if color1 != color2:
#                         continue
#                     elif color1 == color2:
#                         if len(graph[y][1]) > 1:
#                             continue
#                         else:
#                             graph[x][1].remove(color1)
#                             if len(graph[x][1]) == 0:
#                                 return False
#                             for neighbour in graph[x][0]:
#                                 if graph[x][2][0] == 0:
#                                     if [x, neighbour] not in q:
#                                         q.append([x, neighbour])
#                                         q.append([neighbour, x])

#         return True

#     def backtrackMRV(self, graph):
        
#         if self.isComplete(graph):
#             self.result = graph
#             return True
        
#         node = self.selectUnassignedVariableMRV(graph)

#         for color in graph[node][1]:
#             if self.isConsistent(graph, node, color):
#                 graph[node][2][0] = color
#                 graph[node][1].remove(color)
#                 if self.backtrackMRV(graph):
#                     return True
#                 graph[node][1].append(color)
#                 graph[node][2][0] = 0

#         return False

#     def backtrackMrvLcv(self, graph):

#         if self.isComplete(graph):
#             self.result = graph
#             return True
        
#         node = self.selectUnassignedVariableMRV(graph)

#         complete = False

#         temp = copy.deepcopy(graph)

#         while (complete == False):

#             color = self.leastConstrainingValue(temp, node)

#             if len(temp[node][1]) == 0:
#                 return False

#             temp[node][1].remove(color)

#             if self.isConsistent(temp, node, color) == False:
#                 continue

#             if self.arcConsistency(copy.deepcopy(temp), node, color) == False:
#                 continue

#             temp[node][2][0] = color
#             if self.backtrackMrvLcv(temp):
#                 return True
#             temp[node][2][0] = 0
        
#         return False

        
# def main():
#     # print("hello")
#     # print(graph)
#     # print()
    
#     colors = 3

#     for key in graph.keys():
#         graph[key].append([i for i in range(1, colors + 1)])
#         graph[key].append([0])

#     gc = GraphColoring()

#     if gc.backtrackMrvLcv(graph):
#         # print()
#         # print("Node" + "    " + "Color")
#         # print("-------------")
#         # for key, value in gc.result.items():
#         #     print(str(key) + "    ->   " + str(value[2][0]))
#         print(gc.result.items())

#     else:
#         print("Not possible")
    
# if __name__ == "__main__":
#     # print("hello")
#     main()